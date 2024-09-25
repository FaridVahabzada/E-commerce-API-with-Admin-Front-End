var userUpdateSchema = {
    "type": "object",
    "required": [
        "userid",
        "firstname",
        "lastname",
        "address",
        "telephonenumber",
        "roleid"
    ],
    "properties": {
        "userid": {
            "type": "integer",
            "minimum": 1
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
        },
        "roleid": {
            "type": "integer",
            "minimum": 1,
            "maximum": 2
        }
    }
};

module.exports = userUpdateSchema;