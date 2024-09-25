var cartItemCreateSchema = {
    "type": "object",
    "required": [
        "productid",
        "quantity"
    ],
    "properties": {
        "productid": {
            "type": "integer",
            "minimum": 1
        },
        "quantity": {
            "type": "integer",
            "minimum": 1
        }
    }
};

module.exports = cartItemCreateSchema;