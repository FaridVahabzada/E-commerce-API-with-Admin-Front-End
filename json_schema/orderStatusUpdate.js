var orderStatusUpdateSchema = {
    "type": "object",
    "required": [
        "orderstatusid",
        "orderstatus"
    ],
    "properties": {
        "orderstatusid": {
            "type": "integer",
            "minimum": 1
        },
        "orderstatus": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        }
    }
};

module.exports = orderStatusUpdateSchema;