var userDeleteSchema = {
    "type": "object",
    "required": [
        "userid"
    ],
    "properties": {
        "userid": {
            "type": "integer",
            "minimum": 1
        }
    }
};

module.exports = userDeleteSchema;