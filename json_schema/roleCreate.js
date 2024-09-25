var roleCreateSchema = {
    "type": "object",
    "required": [
        "role"
    ],
    "properties": {
        "role": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        }
    }
};

module.exports = roleCreateSchema;