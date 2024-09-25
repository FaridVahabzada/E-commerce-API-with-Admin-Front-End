var cartItemDeleteSchema = {
    "type": "object",
    "required": [
        "cartitemid"
    ],
    "properties": {
        "cartitemid": {
            "type": "integer",
            "minimum": 1
        }
    }
};

module.exports = cartItemDeleteSchema;