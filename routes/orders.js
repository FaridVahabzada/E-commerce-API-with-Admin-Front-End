var express = require('express');
var router = express.Router();

var db = require('../models');
var OrderService = require('../services/OrderService');
var orderService = new OrderService(db);
var OrderItemService = require('../services/OrderItemService');
var orderItemService = new OrderItemService(db);
var UserService = require('../services/UserService');
var userService = new UserService(db);
var MembershipService = require('../services/MembershipService');
var membershipService = new MembershipService(db);
var OrderStatusService = require('../services/OrderStatusService');
var orderStatusService = new OrderStatusService(db);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var jwt = require('jsonwebtoken');

const { isAuth, isAdmin, orderUpdate } = require('../middleware/middleware');

// GET to get authorized user's all orders with all the order items OR to get for admin all users' order history with order items
router.get('/', isAuth, async (req, res, next) => {

	// #swagger.tags = ['The Order & Order Item Tables Endpoints']
	// #swagger.description = "<h3>Gets aunthenticated user's all orders with all the order items or if the authenticated user has an admin role then all the users' order history with the related order items.</h3>"
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const token = req.headers.authorization?.split(' ')[1];
    let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    let userid = decodedToken.userid;
    let userTableEmpty = await userService.getOneByUserId(userid);
    if (userTableEmpty == null) {
        return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such user associated with given token!"}});
    };

    let roleid = userTableEmpty.roleid;
    if (roleid === 1) {
        let ordersAdmin = await orderService.getAll();

        if (Object.keys(ordersAdmin).length == 0) {
            return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there are no orders to show!"}});
        };

        for (i = 0; i < Object.keys(ordersAdmin).length; i++) {
            let ordernumber = ordersAdmin[i].ordernumber;
            let orderItemsOrder = await orderItemService.getAllByOrder(ordernumber);

            let membershipId = ordersAdmin[i].membershipid;
            let membership = await membershipService.getOneById(membershipId);
            ordersAdmin[i].dataValues.discount = membership.discount;

            let orderstatusId = ordersAdmin[i].orderstatusid;
            let orderStatus = await orderStatusService.getOneById(orderstatusId);
            ordersAdmin[i].dataValues.orderstatus = orderStatus.orderstatus;

            ordersAdmin[i].dataValues.orderitems = [];
            for (j = 0; j < Object.keys(orderItemsOrder).length; j++) {
                ordersAdmin[i].dataValues.orderitems.push(orderItemsOrder[j]);
            };
        };
    
        res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "all the orders found are shown below.", "order": ordersAdmin}});
    } else {
        let ordersUser = await orderService.getAllByUser(userid);

        if (Object.keys(ordersUser).length == 0) {
            return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there are no orders to show!"}});
        };

        for (i = 0; i < Object.keys(ordersUser).length; i++) {
            let ordernumber = ordersUser[i].ordernumber;
            let orderItemsOrder = await orderItemService.getAllByOrder(ordernumber);

            let membershipId = ordersUser[i].membershipid;
            let membership = await membershipService.getOneById(membershipId);
            ordersUser[i].dataValues.discount = membership.discount;

            let orderstatusId = ordersUser[i].orderstatusid;
            let orderStatus = await orderStatusService.getOneById(orderstatusId);
            ordersUser[i].dataValues.orderstatus = orderStatus.orderstatus;

            ordersUser[i].dataValues.orderitems = [];
            for (j = 0; j < Object.keys(orderItemsOrder).length; j++) {
                ordersUser[i].dataValues.orderitems.push(orderItemsOrder[j]);
            };
        };
    
        res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "your orders are found.", "order": ordersUser}});
    };
});

// PUT for admins to change an existing order's order status
router.put('/', isAuth, isAdmin, orderUpdate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Order & Order Item Tables Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, if given ordernumber exists, makes changes to order's status based on validated parameters provided in the request's body.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/orderStatusUpdate"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {ordernumber, orderstatusid} = req.body;
    await orderService.updateStatus(ordernumber, orderstatusid);
    let updatedOrder = await orderService.getOneByOrderNumber(ordernumber);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "order status's changed now!", "order": updatedOrder}});
});
  
module.exports = router;