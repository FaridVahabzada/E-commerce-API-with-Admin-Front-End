var orderStatusDeleteSchema = {
    "type": "object",
    "required": [
        "orderstatusid"
    ],
    "properties": {
        "orderstatusid": {
            "type": "integer",
            "minimum": 1
        }
    }
};

module.exports = orderStatusDeleteSchema;