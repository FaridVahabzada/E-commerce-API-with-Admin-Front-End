var orderUpdateSchema = {
    "type": "object",
    "required": [
        "ordernumber",
        "orderstatusid"
    ],
    "properties": {
        "ordernumber": {
            "type": "string",
            "minLength": 8,
          	"maxLength": 8
        },
        "orderstatusid": {
            "type": "integer",
            "minimum": 1,
            "maximum": 3
        }
    }
};

module.exports = orderUpdateSchema;