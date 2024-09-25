var express = require('express');
var router = express.Router();

var db = require('../models');
var ProductService = require('../services/ProductService');
var productService = new ProductService(db);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();


const { checkIfDatabasePopulated, searchValidation } = require('../middleware/middleware');

// POST to populate the database tables
router.post('/init', checkIfDatabasePopulated, async (req, res, next) => {
			
	// #swagger.tags = ['Utility Endpoints']
	// #swagger.description = "<h3>Populates the database, if database is empty.</h3>"

	res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "database's successfully populated!"}});
});

// POST to search the product list for the products
router.post('/search', searchValidation, jsonParser, async (req, res, next) => {
			
	// #swagger.tags = ['Utility Endpoints']
	// #swagger.description = "<h3>Searches the product list on validated parameters provided in the request's body.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/productSearch"
		}
	}
	*/

	const {name, brand, category} = req.body;
    const products = await productService.getAllSearch(name, brand, category);

    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": {"count": Object.keys(products).length, "product": products}}});
});

module.exports = router;