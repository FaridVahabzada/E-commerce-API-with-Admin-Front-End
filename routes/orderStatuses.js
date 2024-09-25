var express = require('express');
var router = express.Router();

var db = require('../models');
var OrderStatusService = require('../services/OrderStatusService');
var orderStatusService = new OrderStatusService(db);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const { checkIfTablesAreEmpty, isAuth, isAdmin, orderStatusCreate, orderStatusUpdate, orderStatusDelete } = require('../middleware/middleware');

// GET to get the order status list
router.get('/', async (req, res, next) => {
				
	// #swagger.tags = ['The Order Status Table Endpoints']
	// #swagger.description = "<h3>Gets the order status list.</h3>"

    const orderStatuses = await orderStatusService.getAll();

    if(orderStatuses.length === 0) {
      return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there are NO order statuses!", "orderstatus": orderStatuses}});
    };

    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "order statuses found.", "orderstatus": orderStatuses}});
});

// POST for admins to create a new order status
router.post('/', checkIfTablesAreEmpty, isAuth, isAdmin, orderStatusCreate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Order Status Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, creates an order status based on validated parameters provided in the request's body.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/orderStatusCreate"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {orderstatus} = req.body;

    await orderStatusService.create(orderstatus);
    let newOrderStatus = await orderStatusService.getOneByName(orderstatus);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "a new order status's created!", "orderstatus": newOrderStatus}});
});

// PUT for admins to change an existing order status
router.put('/', isAuth, isAdmin, orderStatusUpdate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Order Status Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, changes an order status based on validated parameters provided in the request's body. This only happens if it is not a default order status.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/orderStatusChange"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {orderstatusid, orderstatus} = req.body;

    await orderStatusService.update(orderstatusid, orderstatus);
    let updatedOrderStatus = await orderStatusService.getOneById(orderstatusid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "order status's updated!", "orderstatus": updatedOrderStatus}});
});

// DELETE for admins to remove an existing order status
router.delete('/', isAuth, isAdmin, orderStatusDelete, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Order Status Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, removes an order status based on validated parameters provided in the request's body. This happens only if it is not a default order status or there are no orders with this order status.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/orderStatusDelete"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {orderstatusid} = req.body;

    let removedOrderStatus = await orderStatusService.getOneById(orderstatusid);

    await orderStatusService.delete(orderstatusid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "order status's deleted!", "orderstatus": removedOrderStatus}});
});
  
module.exports = router;