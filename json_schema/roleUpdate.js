var roleUpdateSchema = {
    "type": "object",
    "required": [
        "roleid",
        "role"
    ],
    "properties": {
        "roleid": {
            "type": "integer",
            "minimum": 1
        },
        "role": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        }
    }
};

module.exports = roleUpdateSchema;