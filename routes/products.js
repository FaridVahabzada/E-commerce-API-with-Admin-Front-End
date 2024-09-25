var express = require('express');
var router = express.Router();

var db = require('../models');
var ProductService = require('../services/ProductService');
var productService = new ProductService(db);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const { checkIfTablesAreEmpty, isAuth, isAdmin, productCreate, productUpdate, productDelete } = require('../middleware/middleware');

// GET to get the product list
router.get('/', async (req, res, next) => {

	// #swagger.tags = ['The Product Table Endpoints']
	// #swagger.description = "<h3>Gets the product list.</h3>"

    const products = await productService.getAllRawSql();

    if(products.length === 0) {
      return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there are NO products!", "product": products}});
    };

    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "products found.", "product": products}});
});

// POST for admins to create a new product
router.post('/', checkIfTablesAreEmpty, isAuth, isAdmin, productCreate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Product Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, creates a product based on validated parameters provided in the request's body.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/productCreate"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {product, description, unitprice, imgurl, quantity, brandid, categoryid} = req.body;

    await productService.create(product, description, unitprice, imgurl, quantity, brandid, categoryid);
    let newProduct = await productService.getOneByProduct(product);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "a new product's created!", "product": newProduct}});
});

// PUT for admins to change an existing product
router.put('/', isAuth, isAdmin, productUpdate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Product Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, changes a product based on validated parameters provided in the request's body. When this happens if product's unit price is changed then all cart items related to this product in users' active carts get updated prices. Or if product is soft deleted or quantity equalled to zero then all cart items related to this product in users' active carts get removed.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/productChange"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {productid, product, description, unitprice, imgurl, quantity, isdeleted, brandid, categoryid} = req.body;

    await productService.update(productid, product, description, unitprice, imgurl, quantity, isdeleted, brandid, categoryid);
    let updatedProduct = await productService.getOneByProductId(productid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "product's updated!", "product": updatedProduct}});
});

// DELETE for admins to remove an existing product
router.delete('/', isAuth, isAdmin, productDelete, jsonParser, async (req, res, next) => {

	// #swagger.tags = ['The Product Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, removes a product based on validated parameters provided in the request's body. When this happens then all cart items related to this product in users' active carts get removed, if this product is present.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/productDelete"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {productid} = req.body;

    let removedProduct = await productService.getOneByProductId(productid);
    await productService.softDelete(productid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "product's deleted!", "product": removedProduct}});
});
  
module.exports = router;