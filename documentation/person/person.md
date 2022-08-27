## Persons

### PersonController

Path: */persons*

___
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


