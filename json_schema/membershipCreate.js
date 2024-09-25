var membershipCreateSchema = {
    "type": "object",
    "required": [
        "membership",
        "discount"
    ],
    "properties": {
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

module.exports = membershipCreateSchema;