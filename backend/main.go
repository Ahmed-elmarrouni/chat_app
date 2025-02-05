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
	"github.com/jackc/pgx/v5/pgxpool"
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

var dbPool *pgxpool.Pool

// Connect to the database with connection pooling
func connectDB() {
	databaseURL := "postgres://postgres:123456789@localhost:5432/chat_app_db"

	var err error
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		log.Fatalf("Failed to parse database URL: %v\n", err)
	}

	// Connection Pool Settings
	config.MaxConns = 10                 // Max 10 connections
	config.MinConns = 2                  // Keep at least 2 connections ready
	config.MaxConnIdleTime = time.Minute // Close idle connections after 1 min

	dbPool, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Unable to connect to DB: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("DB Connected successfully")
}

// Gracefully close DB connection pool
func DBclose() {
	dbPool.Close()
	fmt.Println("DB connection pool closed")
}

func main() {
	fmt.Println("Starting server...")
	connectDB()

	// Setup Gin router
	r := gin.Default()

	// Configure CORS for frontend access
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	// API Routes
	r.GET("/users", GetUsers)
	r.POST("/users", CreateUser)
	r.GET("/users/:id", GetUserByID)
	r.POST("/login", UserLogin)
	r.PUT("/users/:id", updateUser)

	// Start the server in a goroutine
	go func() {
		fmt.Println("Server running on http://localhost:8080")
		if err := r.Run(":8080"); err != nil {
			log.Fatalf("Server failed: %s", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	fmt.Println("Shutting down server...")
	DBclose()
	fmt.Println("Server shut down successfully")
}

// GET ALL USERS
func GetUsers(c *gin.Context) {
	rows, err := dbPool.Query(context.Background(), "SELECT id, username, email, password, image_url, created_at FROM public.users")
	if err != nil {
		log.Printf("Database error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch users"})
		return
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.ImageUrl, &user.Created_At)
		if err != nil {
			log.Println("Error scanning row:", err)
		}
		users = append(users, user)
	}
	c.JSON(http.StatusOK, users)
}

// Get user by ID
func GetUserByID(c *gin.Context) {
	var user User
	id := c.Param("id")

	err := dbPool.QueryRow(context.Background(),
		"SELECT id, username, email, password, image_url, created_at FROM public.users WHERE id = $1", id).
		Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.ImageUrl, &user.Created_At)

	if err != nil {
		log.Printf("Failed to fetch user with ID %s: %v\n", id, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// Create new user
func CreateUser(c *gin.Context) {
	var newUser User
	if err := c.ShouldBindJSON(&newUser); err != nil {
		log.Println("Invalid request data:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Error hashing password:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	_, err = dbPool.Exec(context.Background(),
		"INSERT INTO public.users (username, email, password, image_url) VALUES ($1, $2, $3, $4)",
		newUser.Username, newUser.Email, string(hashedPassword), newUser.ImageUrl)

	if err != nil {
		log.Printf("Failed to create user: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	var createdUser User
	err = dbPool.QueryRow(context.Background(),
		"SELECT id, username, email, image_url, created_at FROM public.users WHERE email = $1",
		newUser.Email).Scan(&createdUser.ID, &createdUser.Username, &createdUser.Email, &createdUser.ImageUrl, &createdUser.Created_At)

	if err != nil {
		log.Printf("User created but failed to fetch details: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User created but failed to fetch details"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user":    createdUser,
	})
}

// User login
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
	err := dbPool.QueryRow(context.Background(),
		"SELECT id, username, email, password, image_url, created_at FROM public.users WHERE email = $1",
		loginData.Email).Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.ImageUrl, &user.Created_At)

	if err != nil {
		log.Println("User not found for email:", loginData.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

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

// Update user func
func updateUser(c *gin.Context) {
	id := c.Param("id")
	var updateUser struct {
		Username    string  `json:"username"`
		Email       string  `json:"email"`
		Password    string  `json:"password,omitempty"`
		ImageUrl    *string `json:"image_url,omitempty"`
		OldPassword string  `json:"old_password,omitempty"`
		NewPassword string  `json:"new_password,omitempty"`
	}

	if err := c.ShouldBindJSON(&updateUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	var storedPassword string
	err := dbPool.QueryRow(context.Background(),
		"SELECT password FROM public.users WHERE id = $1", id).Scan(&storedPassword)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// If password update is requested, verify old password
	if updateUser.OldPassword != "" && updateUser.NewPassword != "" {
		if err := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(updateUser.OldPassword)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Old password is incorrect"})
			return
		}
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(updateUser.NewPassword), bcrypt.DefaultCost)
		updateUser.Password = string(hashedPassword)
	}

	_, err = dbPool.Exec(context.Background(),
		"UPDATE public.users SET username=$1, email=$2, password=$3, image_url=$4 WHERE id=$5",
		updateUser.Username, updateUser.Email, updateUser.Password, updateUser.ImageUrl, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}
