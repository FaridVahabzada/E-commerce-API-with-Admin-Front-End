var brandCreateSchema = {
    "type": "object",
    "required": [
        "brand"
    ],
    "properties": {
        "brand": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        }
    }
};

module.exports = brandCreateSchema;