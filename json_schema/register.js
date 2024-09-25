var registerSchema = {
    "type": "object",
    "required": [
        "username",
        "email",
        "password",
        "firstname",
        "lastname",
        "address",
        "telephonenumber"
    ],
    "properties": {
        "username": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        },
        "email": {
            "type": "string",
            "pattern": "^\\S+@\\S+\\.\\S+$",
            "format": "email",
            "default": "",
            "minLength": 6,
            "maxLength": 255
        },
        "password": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        },
        "firstname": {
            "type": "string",
            "pattern": "^[A-Za-z\\s]*$",
            "minLength": 2,
          	"maxLength": 255
        },
        "lastname": {
            "type": "string",
            "pattern": "^[A-Za-z\\s]*$",
            "minLength": 2,
          	"maxLength": 255
        },
        "address": {
            "type": "string",
            "minLength": 2,
          	"maxLength": 255
        },
        "telephonenumber": {
            "type": "string",
            "pattern": "^[0-9]{8,}$",
            "minLength": 8,
          	"maxLength": 255
        }
    }
};

module.exports = registerSchema;