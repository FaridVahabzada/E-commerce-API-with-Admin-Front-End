var membershipUpdateSchema = {
    "type": "object",
    "required": [
        "membershipid",
        "membership",
        "discount"
    ],
    "properties": {
        "membershipid": {
            "type": "integer",
            "minimum": 1
        },
        "membership": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        },
        "discount": {
            "type": "number",
            "minimum": 0,
          	"maximum": 100
        }
    }
};

module.exports = membershipUpdateSchema;