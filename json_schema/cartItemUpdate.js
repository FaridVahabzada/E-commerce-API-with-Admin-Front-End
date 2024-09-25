var cartItemUpdateSchema = {
    "type": "object",
    "required": [
        "cartitemid",
        "quantity"
    ],
    "properties": {
        "cartitemid": {
            "type": "integer",
            "minimum": 1
        },
        "quantity": {
            "type": "integer",
            "minimum": 1
        }
    }
};

module.exports = cartItemUpdateSchema;