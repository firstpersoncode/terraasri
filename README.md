## Prerequisites:
- Docker
- Browser
- (optional) Postman or any other tool to make HTTP requests

## Setup
- Clone this repo `git clone git@github.com:firstpersoncode/terraasri.git`
- Build the container `docker compose build`
- Then run the images:
    - database: `docker compose up -d db`
    - backend: `docker compose up -d goapp`
    - frontend: `docker compose up -d nextapp`
- Then open in your browser `http://localhost:3000`

---

### Case 1: Unearthing the Philosopher's Stone
- FE URL: `http://localhost:3000/unearthing-the-philosopher-stone`
- BE API (GET): `http://localhost:8000/api/go/calculate-diagonal-sum/{size}`
- Response:
```go
type ResCalculateDiagonalSum struct {
	Matrix [][]int `json:"matrix"` // generated matrix by input {size}
	Sum    int     `json:"sum"` // calculated diagonals
}
```
- Example:
```bash
curl http://localhost:8000/api/go/calculate-diagonal-sum/3
# output
{"matrix":[[9,8,3],[4,1,5],[7,6,2]],"sum":23}
```

### Case 2: ️ The Time Wizard's Gambit
- FE URL: `http://localhost:3000/the-time-wizard-gambit`
- BE API (POST): `http://localhost:8000/api/go/find-common-slot`
- Request Body:
```go
type ReqFindCommonSlot struct {
	Slots [][][]int `json:"slots"` // 3 dimensional array of time slots for each diplomat
}
```
- Response:
```go
type ResFindCommonSlot struct {
	Common  []int     `json:"common,omitempty"` // The shortest common time slot
	Message string    `json:"message,omitempty"` // Display message if there is no common time slot
}
```
- Example:
```bash
curl http://localhost:8000/api/go/find-common-slot -H "Content-Type: application/json" -d '{"slots":[[[9,12],[14,16]],[[10,12],[15,17]],[[11,13],[16,18]]]}' 
# output
{"common": [11,12]}
```

### Case 3: ️ The Never ending Palindrome Quest
- FE URL: `http://localhost:3000/the-never-ending-palindrome-quest`
- BE API (GET): `http://localhost:8000/api/go/is-circular-palindrome/{text}`
- Response:
```go
type ResIsCircularPalindrome struct {
	Word         string `json:"word"`
	RotatedWord  string `json:"rotated_word"`
	IsPalindrome bool   `json:"is_palindrome"`
}
```
- Example:
```bash
curl http://localhost:8000/api/go/is-circular-palindrome/racecar
# output
{"word": "racecar", "rotated_word": "racecar", "is_palindrome": true}
```

### Case 4: ️ Unveiling the Secrets of Self-Numbers
- FE URL: `http://localhost:3000/unveiling-the-secrets-of-self-numbers`
- BE API (GET): `http://localhost:8000/api/go/self-numbers/{number}`
- Response:
```go
type ResSelfNumbers struct {
	Generator  string `json:"generator"`
	Sum int   `json:"sum"`
}
```
- Example:
```bash
curl http://localhost:8000/api/go/self-numbers/75
# output
{"generator": "75 + 7 + 5", "sum": 87}
```

### Case 5: ️ Decrypting the Emoji Code
- FE URL: `http://localhost:3000/decrypting-the-emoji-code`
- BE API (POST, create emoji): `http://localhost:8000/api/go/secret-message/token`
- Request Body:
```go
type ReqToken struct {
	Name   string `json:"name"`
	Symbol string `json:"symbol"`
	Text   string `json:"text"`
}
```
- Response:
```go
type ResToken struct {
	IdToken int64 `json:"id_token"`
}
```
- Example:
```bash
# create emoji
curl http://localhost:8000/api/go/secret-message/token -H "Content-Type: application/json" -d '{"name": "unique-identifier", "symbol": "😎", "text": "Hello"}' 
# output
{"id_token": 1}
```

- BE API (POST, encode message): `http://localhost:8000/api/go/secret-message/encrypt`
- Request Body:
```go
type ReqMessage struct {
	Message string `json:"message"`
}

```
- Response:
```go
type ResMessage struct {
	Message string `json:"message"`
	Result  string `json:"result"` // encoded message
}

```
- Example:
```bash
# encode message
curl http://localhost:8000/api/go/secret-message/encrypt -H "Content-Type: application/json" -d '{"message": "Hello World"}' 
# output
{"message": "Hello World", "result": "😎 World"}
```

- BE API (POST, decode message): `http://localhost:8000/api/go/secret-message/decrypt`
- Request Body:
```go
type ReqMessage struct {
	Message string `json:"message"`
}

```
- Response:
```go
type ResMessage struct {
	Message string `json:"message"`
	Result  string `json:"result"` // decoded message
}

```
- Example:
```bash
# encode message
curl http://localhost:8000/api/go/secret-message/decrypt -H "Content-Type: application/json" -d '{"message": "😎 World"}' 
# output
{"message": "😎 World", "result": "Hello World"}
```