package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"strings"
)

type Token struct {
	Id     int64
	Name   string
	Symbol string
	Text   string
}

type ReqToken struct {
	Name   string `json:"name"`
	Symbol string `json:"symbol"`
	Text   string `json:"text"`
}

type ResToken struct {
	IdToken int64 `json:"id_token"`
}

type ReqMessage struct {
	Message string `json:"message"`
}

type ResMessage struct {
	Message string `json:"message"`
	Result  string `json:"result"`
}

func initSecretMessageTable(db *sql.DB) {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS tokens (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, symbol TEXT NOT NULL, text TEXT NOT NULL)`)
	if err != nil {
		log.Fatal(err)
	}
}

func addToken(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req ReqToken
		var res ResToken

		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var existingTokenID int64
		var existingSymbol string
		var existingText string

		err = db.QueryRow("SELECT id, symbol, text FROM tokens WHERE name = $1", req.Name).Scan(&existingTokenID, &existingSymbol, &existingText)
		if err == sql.ErrNoRows {
			result, err := db.Exec("INSERT INTO tokens (name, symbol, text) VALUES ($1, $2, $3)", req.Name, req.Symbol, req.Text)
			if err != nil {

				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			existingTokenID, _ = result.LastInsertId()

		} else if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		} else if existingSymbol != req.Symbol || existingText != req.Text {
			_, err := db.Exec("UPDATE tokens SET symbol = $1, text = $2 WHERE id = $3", req.Symbol, req.Text, existingTokenID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

		}

		res.IdToken = existingTokenID

		json.NewEncoder(w).Encode(res)
	}
}

func encryptMessage(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req ReqMessage
		var res ResMessage
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		words := strings.Fields(req.Message)

		if len(words) == 0 {
			http.Error(w, "No words found", http.StatusBadRequest)
			return
		}

		rowsDB, err := db.Query("SELECT symbol, text FROM tokens")
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer rowsDB.Close()

		rows, err := getRowsFromDB(rowsDB)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		res.Message = req.Message
		res.Result = replaceText(req.Message, rows)

		json.NewEncoder(w).Encode(res)
	}
}

func decryptMessage(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req ReqMessage
		var res ResMessage
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		words := strings.Fields(req.Message)

		if len(words) == 0 {
			http.Error(w, "No words found", http.StatusBadRequest)
			return
		}

		rowsDB, err := db.Query("SELECT symbol, text FROM tokens")
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer rowsDB.Close()

		rows, err := getRowsFromDB(rowsDB)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		res.Message = req.Message
		res.Result = revertText(req.Message, rows)

		json.NewEncoder(w).Encode(res)
	}
}

func getRowsFromDB(rows *sql.Rows) ([][]string, error) {
	var result [][]string

	for rows.Next() {
		var symbol, text string
		err := rows.Scan(&symbol, &text)
		if err != nil {
			return nil, err
		}
		result = append(result, []string{symbol, text})
	}

	return result, nil
}

func replaceText(inputText string, replacementArray [][]string) string {
	for _, replacement := range replacementArray {
		pattern := "(" +
			"\\b" +
			"(" +
			regexp.QuoteMeta(replacement[1]) +
			")" +
			"\\b" +
			")"

		re := regexp.MustCompile(pattern)
		inputText = re.ReplaceAllStringFunc(inputText, func(match string) string {
			if match == replacement[1] {
				return replacement[0]
			}
			return match
		})
	}

	return inputText
}

func revertText(inputText string, replacementArray [][]string) string {
	for _, replacement := range replacementArray {
		pattern := regexp.QuoteMeta(replacement[0])
		re := regexp.MustCompile(pattern)
		inputText = re.ReplaceAllStringFunc(inputText, func(match string) string {
			if match == replacement[0] {
				return replacement[1]
			}
			return match
		})
	}

	return inputText
}
