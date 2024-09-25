var brandDeleteSchema = {
    "type": "object",
    "required": [
        "brandid"
    ],
    "properties": {
        "brandid": {
            "type": "integer",
            "minimum": 1
        }
    }
};

module.exports = brandDeleteSchema;