var express = require('express');
var router = express.Router();

var db = require('../models');
var BrandService = require('../services/BrandService');
var brandService = new BrandService(db);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const { checkIfTablesAreEmpty, isAuth, isAdmin, brandCreate, brandUpdate, brandDelete } = require('../middleware/middleware');

// GET to get the brand list
router.get('/', async (req, res, next) => {
				
	// #swagger.tags = ['The Brand Table Endpoints']
	// #swagger.description = "<h3>Gets the brand list.</h3>"

    const brands = await brandService.getAll();

    if(brands.length === 0) {
      return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there are NO brands!", "brand": brands}});
    };

    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "brands found.", "brand": brands}});
});

// POST for admins to create a new brand
router.post('/', checkIfTablesAreEmpty, isAuth, isAdmin, brandCreate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Brand Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, creates a brand based on validated parameters provided in the request's body.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/brandCreate"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {brand} = req.body;

    await brandService.create(brand);
    let newBrand = await brandService.getOneByName(brand);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "a new brand's created!", "brand": newBrand}});
});

// PUT for admins to change an existing brand
router.put('/', isAuth, isAdmin, brandUpdate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Brand Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, changes a brand based on validated parameters provided in the request's body.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/brandChange"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {brandid, brand} = req.body;

    await brandService.update(brandid, brand);
    let updatedBrand = await brandService.getOneById(brandid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "brand's updated!", "brand": updatedBrand}});
});

// DELETE for admins to remove an existing brand
router.delete('/', isAuth, isAdmin, brandDelete, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Brand Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, removes a brand based on validated parameters provided in the request's body. This happens only if there are no products with this brand.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/brandDelete"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {brandid} = req.body;

    let removedBrand = await brandService.getOneById(brandid);
    if (removedBrand == null) {
        return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such brand associated with given brand id!"}});
    };

    await brandService.delete(brandid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "brand's deleted!", "brand": removedBrand}});
});
  
module.exports = router;