var productCreateSchema = {
    "type": "object",
    "required": [
        "product",
        "description",
        "unitprice",
        "imgurl",
        "quantity",
        "brandid",
        "categoryid"
    ],
    "properties": {
        "product": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        },
        "description": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        },
        "unitprice": {
            "type": "number",
            "minimum": 0
        },
        "imgurl": {
            "type": "string",
            "minLength": 1,
          	"maxLength": 255
        },
        "quantity": {
            "type": "integer",
            "minimum": 0
        },
        "brandid": {
            "type": "integer",
            "minimum": 1
        },
        "categoryid": {
            "type": "integer",
            "minimum": 1
        }
    }
};

module.exports = productCreateSchema;