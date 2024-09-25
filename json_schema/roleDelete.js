var roleDeleteSchema = {
    "type": "object",
    "required": [
        "roleid"
    ],
    "properties": {
        "roleid": {
            "type": "integer",
            "minimum": 1
        }
    }
};

module.exports = roleDeleteSchema;