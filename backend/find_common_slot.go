package main

import (
	"encoding/json"
	"math"
	"net/http"
	"sort"
)

type ReqFindCommonSlot struct {
	Slots [][][]int `json:"slots"`
}

type ResFindCommonSlot struct {
	Common  []int  `json:"common,omitempty"`
	Message string `json:"message,omitempty"`
}

func findCommonSlot(w http.ResponseWriter, r *http.Request) {
	var body ReqFindCommonSlot
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var res ResFindCommonSlot

	slots := populateSlots(body.Slots)
	common := commonSlots(flattenedSlots(slots))

	if len(common) == 0 {
		res.Common = nil
		res.Message = "No common slot available"
	} else {
		res.Common = common
	}

	json.NewEncoder(w).Encode(res)
}

func populateSlots(slots [][][]int) [][][]int {
	output := make([][][]int, len(slots))

	for i, user := range slots {
		output[i] = make([][]int, len(user))

		for j, slot := range user {
			start := slot[0]
			end := slot[1]

			for k := start; k <= end; k++ {
				output[i][j] = append(output[i][j], k)
			}
		}
	}

	return output
}

func flattenedSlots(slots [][][]int) [][]int {
	var flattened [][]int
	for _, user := range slots {
		var flattenedUser []int
		for _, slot := range user {
			flattenedUser = append(flattenedUser, slot...)
		}

		sort.Ints(flattenedUser)
		flattened = append(flattened, flattenedUser)
	}

	return flattened
}

func commonSlots(slots [][]int) []int {
	var duplicates []int
	var result []int

	occurrenceMap := make(map[int]int)
	for _, row := range slots {
		for _, value := range row {
			occurrenceMap[value]++
			if occurrenceMap[value] > 1 {
				duplicates = append(duplicates, value)
			}
		}
	}

	sort.Ints(duplicates)
	countMap := make(map[int]int)
	minDuplicates := len(slots) - 1

	for _, num := range duplicates {
		countMap[num]++
	}

	for num, count := range countMap {
		if count >= minDuplicates {
			result = append(result, num)
		}
	}

	sort.Ints(result)
	closestSlot := closestValues(result)

	return closestSlot
}

func closestValues(arr []int) []int {
	if len(arr) < 2 {
		return nil
	}

	minDiff := math.MaxInt64
	first, second := arr[0], arr[1]
	for i := 1; i < len(arr); i++ {
		for j := i - 1; j >= 0; j-- {
			diff := int(math.Abs(float64(arr[i] - arr[j])))
			if diff < minDiff {
				minDiff = diff
				first, second = arr[j], arr[i]
			}
		}
	}

	if first > second {
		first, second = second, first
	}

	return []int{first, second}
}
