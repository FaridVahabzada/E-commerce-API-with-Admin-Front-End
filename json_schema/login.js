var loginSchema = {
    "type": "object",
    "required": [
        "password"
    ],
    "properties": {
        "username": {
            "type": "string",
            /*"minLength": 1,
          	"maxLength": 255*/
        },
        "email": {
            "type": "string",
            /*"pattern": "^\\S+@\\S+\\.\\S+$",
            "format": "email",
            "default": "",
            "minLength": 6,
            "maxLength": 255*/
        },
        "password": {
            "type": "string",
            /*"minLength": 1,
          	"maxLength": 255*/
        }
    }
};

module.exports = loginSchema;