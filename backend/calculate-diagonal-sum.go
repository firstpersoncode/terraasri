package main

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type ResCalculateDiagonalSum struct {
	Matrix [][]int `json:"matrix"`
	Sum    int     `json:"sum"`
}

func calculateDiagonalSum(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	sizeString := vars["size"]
	size, err := strconv.Atoi(sizeString)

	if err != nil {
		http.Error(w, "Invalid size", http.StatusInternalServerError)
		return
	}

	matrix := shuffle(generateMatrix(size))

	var res ResCalculateDiagonalSum
	res.Matrix = matrix
	res.Sum = sumTopLeftBottomRight(matrix) + sumTopRightBottomLeft(matrix)

	json.NewEncoder(w).Encode(res)
}

func generateMatrix(size int) [][]int {
	matrix := make([][]int, size)
	counter := 1

	for i := range matrix {
		matrix[i] = make([]int, size)
		for j := range matrix[i] {
			matrix[i][j] = counter
			counter++
		}
	}

	return matrix
}

func shuffle(matrix [][]int) [][]int {
	for i := range matrix {
		for j := range matrix[i] {
			r := i + rand.Intn(len(matrix)-i)
			c := j + rand.Intn(len(matrix[i])-j)

			matrix[i][j], matrix[r][c] = matrix[r][c], matrix[i][j]
		}
	}

	return matrix
}

func sumTopLeftBottomRight(matrix [][]int) int {
	sum := 0
	for i := 0; i < len(matrix); i++ {
		sum += matrix[i][i]
	}
	return sum
}

func sumTopRightBottomLeft(matrix [][]int) int {
	sum := 0
	for i := 0; i < len(matrix); i++ {
		sum += matrix[i][len(matrix[i])-1-i]
	}
	return sum
}
