var orderStatusCreateSchema = {
    "type": "object",
    "required": [
        "orderstatus"
    ],
    "properties": {
        "orderstatus": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        }
    }
};

module.exports = orderStatusCreateSchema;