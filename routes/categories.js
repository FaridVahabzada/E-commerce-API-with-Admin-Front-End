var express = require('express');
var router = express.Router();

var db = require('../models');
var CategoryService = require('../services/CategoryService');
var categoryService = new CategoryService(db);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const { checkIfTablesAreEmpty, isAuth, isAdmin, categoryUpdate, categoryDelete } = require('../middleware/middleware');

// GET to get the category list
router.get('/', async (req, res, next) => {
				
	// #swagger.tags = ['The Category Table Endpoints']
	// #swagger.description = "<h3>Gets the category list.</h3>"

    const categories = await categoryService.getAll();

    if(categories.length === 0) {
      return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there are NO categories!", "category": categories}});
    };

    if (categories.length === 1) {
        res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "category found.", "category": categories}});
    } else {
        res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "categories found.", "category": categories}});
    };
});

// POST for admins to create a new category
router.post('/', checkIfTablesAreEmpty, isAuth, isAdmin, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Category Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, creates a category based on validated parameters provided in the request's body.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/categoryCreate"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {category} = req.body;

    /*if ((category == "") || (category == null)) {
        return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "category is required!"}});
    };*/
    
    /*const categories = await categoryService.getOneByName(category);

    if (categories != null) {
        return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there already exists such category!"}});
    };*/

    try {
        await categoryService.create(category);
    } catch (err) {
        return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": err.errors.map(error => error.message)}});
    };
    
    let newCategory = await categoryService.getOneByName(category);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "a new category's created!", "category": newCategory}});
});

// PUT for admins to change an existing category
router.put('/', isAuth, isAdmin, categoryUpdate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Category Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, changes a category based on validated parameters provided in the request's body.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/categoryChange"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {categoryid, category} = req.body;

    await categoryService.update(categoryid, category);
    let updatedCategory = await categoryService.getOneById(categoryid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "category's updated!", "category": updatedCategory}});
});

// DELETE for admins to remove an existing category
router.delete('/', isAuth, isAdmin, categoryDelete, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Category Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, removes a category based on validated parameters provided in the request's body. This happens only if there are no products with this category.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/categoryDelete"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {categoryid} = req.body;

    let removedCategory = await categoryService.getOneById(categoryid);
    if (removedCategory == null) {
        return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such category associated with given categoryid!"}});
    };

    await categoryService.delete(categoryid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "category's deleted!", "category": removedCategory}});
});
  
module.exports = router;