# Node js API.

## installation 

```bash
npm install && npx prisma generate 
```

## DataBase

Update the .env with your database credentials ad run 

```bash
npx prisma db push
```


## Tests

```bash
npx jest
```


## Build and run 

```bash
npm start
```

#### app will start http://localhost:1244

___
# Resources

## Persons

### PersonController

Path: */persons*

#### GetAll

Path: */getall*

Verb: *Get*


Response:
```json
[
	{
		"Id": 1,
		"Email": "adriano@gmail.com",
		"Name": "Adriano",
		"Phone": "12982068255"
	},
	{
		"Id": 2,
		"Email": "camila@gmail.com",
		"Name": "Camila",
		"Phone": "12982068255"
	},
	{
		"Id": 3,
		"Email": "juliana@gmail.com",
		"Name": "Juliana",
		"Phone": "12982068255"
	}
]
```



___
#### Add

Path: */add*

Verb: *Post*

Request:
```json
{
	"person" : {
          "Email": "insominia@gmail.com",
          "Name": "Insominia",
          "Phone": "12987456123"
			}
}
```

Response:
```json
{
	"error": {
		"message": "Validation fails",
		"details": [
			"The email is not a valid email address"
		]
	}
}
```


___
#### Update

Path: */update*

Verb: *Put*

Request:
```json
{
	"person" : {
          "Email": "insominia@gmail.com",
          "Name": "Insominia",
          "Phone": "12987456123"
			}
}
```

Response:
```json
{
	"error": {
		"message": "Validation fails",
		"details": [
			"The email is not a valid email address"
		]
	}
}
```




## Events

### EventController

Path: */events*

#### GetAll

Path: */getall*

Verb: *Get*


Response:
```json
[
	{
		"Id": 6,
		"Title": "Evento",
		"Description": "Evento teste",
		"OwnerId": 1,
		"Date": "2022-08-27T19:21:41.651Z",
		"Owner": {
			"Id": 1,
			"Email": "adriano@gmail.com",
			"Name": "Adriano",
			"Phone": "12982068255"
		},
		"Participants": [
			{
				"Id": 6,
				"EventId": 6,
				"PersonId": 3
			}
		]
	},
	{
		"Id": 5,
		"Title": "Evento",
		"Description": "Evento teste",
		"OwnerId": 1,
		"Date": "2022-08-27T19:21:41.362Z",
		"Owner": {
			"Id": 1,
			"Email": "adriano@gmail.com",
			"Name": "Adriano",
			"Phone": "12982068255"
		},
		"Participants": [
			{
				"Id": 5,
				"EventId": 5,
				"PersonId": 3
			}
		]
	}
]
```




#### GetAll

Path: */getall*

Verb: *Get*


Request:
```json
{
	"event" : {
		"Id": 132,
		"Title": "xbox",
		"Description": "Evento teste que mudou",		
		"Date": "2022-10-27T18:38:51.049Z",
		"Owner": {
			"Id": 2,
			"Email": "xbox@gmail.com",
			"Name": "Adriano",
			"Phone": "12982068255"
		}
	}
}
```

