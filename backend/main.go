package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

// main function
func main() {
	// connect to database
	// db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer db.Close()

	// create table if it doesn't exist
	// _, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, email TEXT)")
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// create router
	router := mux.NewRouter()
	// router.HandleFunc("/api/go/users", getUsers(db)).Methods("GET")
	// router.HandleFunc("/api/go/users", createUser(db)).Methods("POST")
	// router.HandleFunc("/api/go/users/{id}", getUser(db)).Methods("GET")
	// router.HandleFunc("/api/go/users/{id}", updateUser(db)).Methods("PUT")
	// router.HandleFunc("/api/go/users/{id}", deleteUser(db)).Methods("DELETE")
	router.HandleFunc("/api/go/calculate-diagonal-sum/{size}", calculateDiagonalSum).Methods("GET")
	router.HandleFunc("/api/go/find-common-slot", findCommonSlot).Methods("POST")

	// wrap the router with CORS and JSON content type middlewares
	enhancedRouter := enableCORS(jsonContentTypeMiddleware(router))
	// start server
	log.Fatal(http.ListenAndServe(":8000", enhancedRouter))
}
