var express = require('express');
var router = express.Router();

var db = require('../models');
var CartService = require('../services/CartService');
var cartService = new CartService(db);
var CartItemService = require('../services/CartItemService');
var cartItemService = new CartItemService(db);
var OrderService = require('../services/OrderService');
var orderService = new OrderService(db);
var OrderItemService = require('../services/OrderItemService');
var orderItemService = new OrderItemService(db);
var ProductService = require('../services/ProductService');
var productService = new ProductService(db);
var UserService = require('../services/UserService');
var userService = new UserService(db);
var MembershipService = require('../services/MembershipService');
var membershipService = new MembershipService(db);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var jwt = require('jsonwebtoken');

const { checkIfTablesAreEmpty, isAuth, cartItemCreate, cartItemUpdate, cartItemDelete, cartItemCheckOut } = require('../middleware/middleware');

// GET to get authorized user's active cart with all the items
router.get('/', isAuth, async (req, res, next) => {

	// #swagger.tags = ['The Cart & Cart Item Tables Endpoints']
	// #swagger.description = "<h3>Gets aunthenticated user's active cart with all the cart items in it.</h3>"
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const token = req.headers.authorization?.split(' ')[1];
    let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    let userId = decodedToken.userid;
    let userTableEmpty = await userService.getOneByUserId(userId);
    if (userTableEmpty == null) {
        return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such user associated with given token!"}});
    };
    let activeCart = await cartService.getActiveCart(userId);
    let cartId = activeCart.cartid;
    let activeCartItems = await cartItemService.getAllByCart(cartId);

    let membershipId = activeCart.membershipid;
    let membership = await membershipService.getOneById(membershipId);
    activeCart.dataValues.discount = membership.discount;
    
    if(activeCartItems.length === 0) {
      return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there are NO cart items in your cart!", "cart": activeCart, "cartitem": activeCartItems}});
    };

    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "cart items found.", "cart": activeCart, "cartitem": activeCartItems}});
});

// POST for authorized user to add a cart item to their active cart
router.post('/', checkIfTablesAreEmpty, isAuth, cartItemCreate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Cart & Cart Item Tables Endpoints']
	// #swagger.description = "<h3>If user is authorized, adds a cart item to their cart based on validated parameters provided in the request's body. Also, calculates the total cost based on quantity and discount, checks for duplicate items if so updates quantity accordingly, depending on the product quantity availability makes quantitative decisions.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/cartItemCreate"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {productid} = req.body;
    
    const token = req.headers.authorization?.split(' ')[1];
    let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    let userId = decodedToken.userid;
    let activeCart = await cartService.getActiveCart(userId);
    let cartId = activeCart.cartid;

    let addedCartItem = await cartItemService.getOneByProductAndCart(cartId, productid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "item's added to the cart!", "cartitem": addedCartItem}});
});

// POST for authorized user to check out their active cart
router.post('/checkout/now', checkIfTablesAreEmpty, isAuth, cartItemCheckOut, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Cart & Cart Item Tables Endpoints']
	// #swagger.description = "<h3>If user is authorized, checks out a cart with its items based on validated parameters provided in the request's body. Also, if there are no items inside the active cart cancels the operation, checks again if enough product availability is present, recalculates the total cost based on quantity and discount before the check-out, creates unique order number, creates order and order items, updates users membership status, soft deletes the cart with its items, creates a new cart, updates product quantity and much more...</h3>"
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const token = req.headers.authorization?.split(' ')[1];
    let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    let userId = decodedToken.userid;
    let updatedActiveCart = await cartService.getActiveCart(userId);
    let cartId = updatedActiveCart.cartid;
    let total = updatedActiveCart.total;
    let user = await userService.getOneByUserId(userId);
    let membershipId = user.membershipid;

    let orderNumber = Math.random().toString(36).slice(-8);
    let orderNumberExists = await orderService.getOneByOrderNumber(orderNumber);
    if (orderNumberExists != null) {
        while (orderNumberExists == null) {
            orderNumber = Math.random().toString(36).slice(-8);
            orderNumberExists = await orderService.getOneByOrderNumber(orderNumber);
        };
    };

    await orderService.create(orderNumber, userId, membershipId, total);

    let cartItems = await cartItemService.getAllByCartJoin(cartId);

    for (i = 0; i < Object.keys(cartItems).length; i++) {
        let product = await productService.getOneByProductId(cartItems[i].productid);
        let productId = product.productid;
        let unitPrice = product.unitprice;
        let quantity = cartItems[i].cartitemquantity;
        await orderItemService.create(orderNumber, productId, quantity, unitPrice);
    };

    await cartService.softDelete(cartId);

    for (i = 0; i < Object.keys(cartItems).length; i++) {
        let product = await productService.getOneByProductId(cartItems[i].productid);
        let productId = product.productid;
        let productQuantity = product.quantity;
        let cartItemQuantity = cartItems[i].cartitemquantity;
        let newProductQuantity = productQuantity - cartItemQuantity;
        await productService.updateQuantity(productId, newProductQuantity);
    };

    let ordersByUserId = await orderService.getAllByUser(userId);
    let orderQuantity = 0;
    for (i = 0; i < Object.keys(ordersByUserId).length; i++) {
        let orderNumberByUser = ordersByUserId[i].ordernumber;
        let orderItems = await orderItemService.getAllByOrder(orderNumberByUser);
        for (j = 0; j < Object.keys(orderItems).length; j++) {
            let orderItemsQuantity = orderItems[j].orderitemquantity;
            orderQuantity += orderItemsQuantity;
        };
    };

    if (orderQuantity >= 15 && orderQuantity <= 30) {
        await userService.updateMembership(userId, 2);
    } else if (orderQuantity > 30) {
        await userService.updateMembership(userId, 3);
    };

    let updatedUser = await userService.getOneByUserId(userId);
    let updatedMembershipId = updatedUser.membershipid;
    await cartService.create(userId, updatedMembershipId);

    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": `Check-out was a success! Your order number for the purchase is ${orderNumber}!`}});
});

// PUT for authorized user to change the quantity of cart item in their active cart
router.put('/', isAuth, cartItemUpdate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Cart & Cart Item Tables Endpoints']
	// #swagger.description = "<h3>If user is authorized, makes changes to cart item's quantity in their active cart based on validated parameters provided in the request's body. Also, checks if the cart is the active one, makes decisions based on available product quantity, recalculates the total cost based on quantity and discount.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/cartItemQuantiyChange"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {cartitemid} = req.body;
    let updatedCartItem = await cartItemService.getOneByCartItemId(cartitemid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "cart item quantity's changed now!", "cartitem": updatedCartItem}});
});

// DELETE for authorized user to remove a cart item from their active cart
router.delete('/', isAuth, cartItemDelete, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Cart & Cart Item Tables Endpoints']
	// #swagger.description = "<h3>If user is authorized, removes a cart item from their active cart based on validated parameters provided in the request's body. Also, checks if the cart is the active one, recalculates the total cost based on quantity and discount.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/cartItemDelete"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {cartitemid} = req.body;

	let deletedCartItem = await cartItemService.getOneByCartItemId(cartitemid);
    await cartItemService.deleteByCartItemId(cartitemid);

    const token = req.headers.authorization?.split(' ')[1];
    let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    let userId = decodedToken.userid;

    let activeCart = await cartService.getActiveCart(userId);
    let cartId = activeCart.cartid;

    let user = await userService.getOneByUserId(userId);
    let membershipId = user.membershipid;
    let membership = await membershipService.getOneById(membershipId);
    let discount = membership.discount;

    async function updateTotal() {
        let total = 0;
        let allCartItems = await cartItemService.getAllByCartJoin(cartId);
        for (i = 0; i < Object.keys(allCartItems).length; i++) {
            let productCost = allCartItems[i].unitprice * allCartItems[i].cartitemquantity;
            total += (productCost - ((productCost * discount) / 100));
        };
        await cartService.updateTotal(cartId, total);
    };
    updateTotal();
    
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "cart item's deleted now!", "cartitem": deletedCartItem}});
});
  
module.exports = router;