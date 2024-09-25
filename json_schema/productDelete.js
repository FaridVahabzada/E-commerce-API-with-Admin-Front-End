var productDeleteSchema = {
    "type": "object",
    "required": [
        "productid"
    ],
    "properties": {
        "productid": {
            "type": "integer",
            "minimum": 1
        }
    }
};

module.exports = productDeleteSchema;