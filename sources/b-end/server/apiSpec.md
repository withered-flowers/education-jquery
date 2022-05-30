## List of Available Endpoints:
- POST /login
- GET /todos
- POST /todos

### POST /login

#### Request
- Body
    ```json
    {
      username: String
    }
    ```

#### Response
_200 - OK_

- Body
    ```json
    {
      "statusCode": 200,
      "data": {
          "access_token": String
      },
    }    
    ```

### GET /todos

#### Response
_200 - OK_

- Body
    ```json
    {
      "statusCode": 200,
      "data": {
        "todos": [
          {
            "id": Integer,
            "name": String,
            "isCompleted": Boolean,
            "by": String
          },
          ...
        ]
      }
    }
    ```

### POST /todos

#### Request
- Headers
    ```json
    {
      "Content-Type": "application/x-www-form-urlencoded",
      "access_token": String
    }
- Body
    ```json
    {
      "todoName": String,
    }
    ```
#### Response
_201 - Created_
- Body
    ```json
    {
      "statusCode": 201,
      "data": {
        "id": Integer,
        "name": String,
        "isCompleted": Boolean,
        "by": String
      }
    }
    ```