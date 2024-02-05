package main

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

type ResIsCircularPalindrome struct {
	Word         string `json:"word"`
	RotatedWord  string `json:"rotated_word"`
	IsPalindrome bool   `json:"is_palindrome"`
}

func isCircularPalindrome(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	word := vars["word"]

	if len(word) <= 1 {
		http.Error(w, "Invalid word", http.StatusBadRequest)
		return
	}

	word = strings.ToLower(word)
	rotatedWord := rotateString(word)

	var res ResIsCircularPalindrome
	res.Word = word
	res.RotatedWord = rotatedWord
	res.IsPalindrome = word == rotatedWord

	json.NewEncoder(w).Encode(res)
}

func rotateString(s string) string {
	runes := []rune(s)
	length := len(runes)

	for i, j := 0, length-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}

	return string(runes)
}
