var productUpdateSchema = {
    "type": "object",
    "required": [
        "productid",
        "product",
        "description",
        "unitprice",
        "imgurl",
        "quantity",
        "isdeleted",
        "brandid",
        "categoryid"
    ],
    "properties": {
        "productid": {
            "type": "integer",
            "minimum": 1
        },
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
        "isdeleted": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1
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

module.exports = productUpdateSchema;