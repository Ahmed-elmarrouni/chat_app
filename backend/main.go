package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type User struct {
	ID         int       `json:"id"`
	Username   string    `json:"username"`
	Email      string    `json:"email"`
	Password   string    `json:"password"`
	ImageUrl   *string   `json:"image_url"`
	Created_At time.Time `json:"created_at"`
}

func main() {
	fmt.Println("hello")
	connectDB()
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	r.GET("/users", GetUsers)
	r.POST("/users", CreateUser)

	go func() {
		fmt.Println("server running on http://localhost:8080")
		if err := r.Run(":8080"); err != nil {
			log.Fatalf("server Failed : %s", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	fmt.Println("Shutting down server")
	DBclose()
	fmt.Println("Server shut down succsessfuly")
}

// GET ALL USERS
func GetUsers(c *gin.Context) {
	rows, err := conn.Query(context.Background(), "SELECT id, username, email, password, image_url, created_at FROM public.users")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"err": "failed to fetch users"})
		return
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.ImageUrl, &user.Created_At)
		if err != nil {
			log.Println("Err scaning Now:", err)
		}
		users = append(users, user)
	}
	c.JSON(http.StatusOK, users)
}

func CreateUser(c *gin.Context) {
	var newUser User
	if err := c.ShouldBindJSON(&newUser); err != nil {
		log.Println("JSON Bind Error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Convert empty string to NULL
	var imageURL interface{}
	if newUser.ImageUrl == nil || *newUser.ImageUrl == "" {
		imageURL = nil
	} else {
		imageURL = *newUser.ImageUrl
	}

	_, err := conn.Exec(context.Background(),
		"INSERT INTO public.users (username, email, password, image_url) VALUES ($1, $2, $3, $4)",
		newUser.Username, newUser.Email, newUser.Password, imageURL)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}
