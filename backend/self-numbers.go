package main

import (
	"encoding/json"
	"net/http"
	"strconv"
)

type ResSelfNumbers struct {
	Sum int `json:"sum"`
}

func selfNumbers(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	startString := queryParams.Get("start")
	endString := queryParams.Get("end")

	start, err := strconv.Atoi(startString)

	if err != nil || start <= 0 {
		http.Error(w, "Invalid start", http.StatusInternalServerError)
		return
	}

	end, err := strconv.Atoi(endString)

	if err != nil || end <= start {
		http.Error(w, "Invalid end", http.StatusInternalServerError)
		return
	}

	var res ResSelfNumbers

	selfNumbers := make(map[int]bool)
	sum := 0

	for i := start; i <= end; i++ {
		if isSelfNumber(i, selfNumbers) {
			selfNumbers[i] = true
			sum += i
		}
	}

	res.Sum = sum

	json.NewEncoder(w).Encode(res)
}

func isSelfNumber(n int, selfNumbers map[int]bool) bool {
	generator := d(n)
	return !selfNumbers[generator]
}

func d(n int) int {
	sum := n
	for n > 0 {
		sum += n % 10
		n /= 10
	}
	return sum
}
