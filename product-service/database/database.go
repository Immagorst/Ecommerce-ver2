// database/database.go
package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DB is the database connection instance
var DB *mongo.Database

// ConnectDB connects to the MongoDB database
func ConnectDB() *mongo.Client {
	// In a real app, you'd get this from an environment variable
	uri := "mongodb+srv://admin:uIHpehtb6Yp5Qq5O@cluster0.chpt5bc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

	client, err := mongo.NewClient(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	// Ping the database to verify the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Could not connect to MongoDB: ", err)
	} else {
		log.Println("Connected to MongoDB!")
	}

	DB = client.Database("product_db")
	return client
}