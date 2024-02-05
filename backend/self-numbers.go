package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type ResSelfNumbers struct {
	Generator string `json:"generator"`
	Sum       int    `json:"sum"`
}

func selfNumbers(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	numberString := vars["number"]
	number, err := strconv.Atoi(numberString)

	if err != nil {
		http.Error(w, "Invalid number", http.StatusInternalServerError)
		return
	}

	if number <= 0 {
		http.Error(w, "Invalid number", http.StatusBadRequest)
		return
	}

	var res ResSelfNumbers
	res.Generator = numberString
	res.Sum = d(number)

	json.NewEncoder(w).Encode(res)
}

func d(n int) int {
	sum := n
	for n > 0 {
		sum += n % 10
		n /= 10
	}
	return sum
}
