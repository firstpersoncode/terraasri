package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

// main function
func main() {
	// connect to database
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	initSecretMessageTable(db)
	router := mux.NewRouter()
	router.HandleFunc("/api/go/calculate-diagonal-sum/{size}", calculateDiagonalSum).Methods("GET")
	router.HandleFunc("/api/go/find-common-slot", findCommonSlot).Methods("POST")
	router.HandleFunc("/api/go/is-circular-palindrome/{word}", isCircularPalindrome).Methods("GET")
	router.HandleFunc("/api/go/self-numbers/{number}", selfNumbers).Methods("GET")
	router.HandleFunc("/api/go/secret-message/token", addToken(db)).Methods("POST")
	router.HandleFunc("/api/go/secret-message/encrypt", encryptMessage(db)).Methods("POST")
	router.HandleFunc("/api/go/secret-message/decrypt", decryptMessage(db)).Methods("POST")
	enhancedRouter := enableCORS(jsonContentTypeMiddleware(router))
	log.Fatal(http.ListenAndServe(":8000", enhancedRouter))
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*") // Allow any origin
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Check if the request is for CORS preflight
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Pass down the request to the next middleware (or final handler)
		next.ServeHTTP(w, r)
	})
}

func jsonContentTypeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set JSON Content-Type
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}
