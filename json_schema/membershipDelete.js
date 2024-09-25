var membershipDeleteSchema = {
    "type": "object",
    "required": [
        "membershipid"
    ],
    "properties": {
        "membershipid": {
            "type": "integer",
            "minimum": 1
        }
    }
};

module.exports = membershipDeleteSchema;