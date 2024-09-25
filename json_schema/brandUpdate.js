var brandUpdateSchema = {
    "type": "object",
    "required": [
        "brandid",
        "brand"
    ],
    "properties": {
        "brandid": {
            "type": "integer",
            "minimum": 1
        },
        "brand": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        }
    }
};

module.exports = brandUpdateSchema;