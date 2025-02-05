// package main

// import (
// 	"context"
// 	"fmt"
// 	"log"
// 	"os"

// 	"github.com/jackc/pgx/v5"
// )

// var conn *pgx.Conn

// func connectDB() {
// 	databaseURL := "postgres://postgres:123456789@localhost:5432/chat_app_db"

// 	var err error

// 	conn, err = pgx.Connect(context.Background(), databaseURL)

// 	if err != nil {
// 		log.Fatalf("Unable to coonnect to DB: %v\n", err)
// 		os.Exit(1)
// 	}

// 	fmt.Println("DB Connected successfully")
// }

// func DBclose() {
// 	conn.Close(context.Background())
// 	fmt.Println("Db connectoin close")
// }

// ? ----------------------------------------
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Global connection pool (exported so it can be used in main.go)
var DbPool *pgxpool.Pool

// ConnectDB initializes the connection pool
func ConnectDB() {
	databaseURL := "postgres://postgres:123456789@localhost:5432/chat_app_db"

	var err error
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		log.Fatalf("Failed to parse database URL: %v\n", err)
	}

	// Set connection pool settings
	config.MaxConns = 10                 // Allow up to 10 connections
	config.MinConns = 2                  // Keep at least 2 connections ready
	config.MaxConnIdleTime = time.Minute // Close idle connections after 1 min

	DbPool, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Unable to connect to DB: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("DB Connected successfully")
}

// DBClose closes the connection pool
func DBClose() {
	DbPool.Close()
	fmt.Println("DB connection pool closed")
}
