var categoryUpdateSchema = {
    "type": "object",
    "required": [
        "categoryid",
        "category"
    ],
    "properties": {
        "categoryid": {
            "type": "integer",
            "minimum": 1
        },
        "category": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        }
    }
};

module.exports = categoryUpdateSchema;