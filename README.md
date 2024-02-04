## Prerequisites:
- Docker
- (optional) Postman or any other tool to make HTTP requests
- Browser

## Setup
Clone this repo
Build the container `docker compose build`
Then run the images:
- database: `docker compose up -d db`
- backend: `docker compose up -d goapp`


### Case 1: Unearthing the Philosopher's Stone
Endpoint: `http://localhost:8000/api/go/calculate-diagonal-sum/{size}`
Method: GET
Response:
```go
type ResCalculateDiagonalSum struct {
	Matrix [][]int `json:"matrix"` // generated matrix by input {size}
	Sum    int     `json:"sum"` // calculated diagonals
}
```

Example:
```bash
curl http://localhost:8000/api/go/calculate-diagonal-sum/3
# output
{"matrix":[[9,8,3],[4,1,5],[7,6,2]],"sum":23}
```

### Case 2: ️ The Time Wizard's Gambit
Endpoint: `http://localhost:8000/api/go/find-common-slot`
Method: POST
Request Body:
```go
type ReqFindCommonSlot struct {
	Slots [][][]int `json:"slots"` // 3 dimensional array of time slots for each diplomat
}
```
Response:
```go
type ResFindCommonSlot struct {
	Common  []int     `json:"common,omitempty"` // The shortest common time slot
	Message string    `json:"message,omitempty"` // Display message if there is no common time slot
}
```

Example:
```bash
curl http://localhost:8000/api/go/find-common-slot -H "Content-Type: application/json" -d '{"slots":[[[9,12],[14,16]],[[10,12],[15,17]],[[11,13],[16,18]]]}' 
# output
{"common": [11,12]}
```