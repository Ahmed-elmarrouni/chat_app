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
	"golang.org/x/crypto/bcrypt"
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
	r.GET("/users/:id", GetUserByID)
	r.POST("/login", UserLogin)

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

// Get user by ID
func GetUserByID(c *gin.Context) {
	var user User
	id := c.Param("id")
	err := conn.QueryRow(context.Background(), "SELECT id, username, email, password, image_url, created_at FROM public.users WHERE id = $1", id).Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.ImageUrl, &user.Created_At)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}
	c.JSON(http.StatusOK, user)

}

func CreateUser(c *gin.Context) {
	var newUser User
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	_, err = conn.Exec(context.Background(),
		"INSERT INTO public.users (username, email, password, image_url) VALUES ($1, $2, $3, $4)",
		newUser.Username, newUser.Email, string(hashedPassword), newUser.ImageUrl)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	var createdUser User
	err = conn.QueryRow(context.Background(),
		"SELECT id, username, email, image_url, created_at FROM public.users WHERE email = $1",
		newUser.Email).Scan(&createdUser.ID, &createdUser.Username, &createdUser.Email, &createdUser.ImageUrl, &createdUser.Created_At)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User created but failed to fetch details"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user":    createdUser,
	})
}

func UserLogin(c *gin.Context) {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		log.Println("Invalid login request data:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	var user User
	err := conn.QueryRow(context.Background(),
		"SELECT id, username, email, password, image_url, created_at FROM public.users WHERE email = $1",
		loginData.Email).Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.ImageUrl, &user.Created_At)

	if err != nil {
		log.Println("User not found for email:", loginData.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Log stored and received passwords
	log.Println("Stored Password:", user.Password)
	log.Println("Received Password:", loginData.Password)

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginData.Password)); err != nil {
		log.Println("Password mismatch for email:", loginData.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	token := "mocked-jwt-token"

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user": gin.H{
			"id":         user.ID,
			"username":   user.Username,
			"email":      user.Email,
			"image_url":  user.ImageUrl,
			"created_at": user.Created_At,
		},
		"token": token,
	})
}
