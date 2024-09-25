var express = require('express');
var router = express.Router();

var crypto = require('crypto');

var db = require('../models');
var UserService = require('../services/UserService');
var userService = new UserService(db);
var CartService = require('../services/CartService');
var cartService = new CartService(db);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var jwt = require('jsonwebtoken');

const { checkIfTablesAreEmpty, registerValidationAndErrorHandling, loginValidationAndErrorHandling, isAuth, isAdmin, userUpdate, userDelete } = require('../middleware/middleware');

// POST for registered users to be able to login
router.post('/auth/login', loginValidationAndErrorHandling, jsonParser, async (req, res, next) => {
			
	// #swagger.tags = ['Login & Registration']
	// #swagger.description = "<h3>Logins a user based on validated parameters provided in the request's body. (Also creates token cookie (if user is admin) or clears cookies (if user is not admin).)</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/userLogin"
		}
	}
	*/

	const { username, email, password } = req.body;

	userService.getOne(username, email).then((data) => {
		crypto.pbkdf2(password, data.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
			if (err) { return cb(err); };
			if (!crypto.timingSafeEqual(data.password, hashedPassword)) {
				return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "incorrect username / email or password!"}});
			};
			try {
				token = jwt.sign(
					{ userid: data.userid, username: data.username, email: data.email, roleid: data.roleid, membershipid: data.membershipid },
					process.env.TOKEN_SECRET,
					{ expiresIn: "2h" }
				);
			} catch (err) {
				return res.status(500).json({"status": "error", "statuscode": 500, "data": {
																							"result": "something went wrong with creating JWT token!", 
																							"error message": err.message
																						   }
				});
			};

			if (data.roleid === 1) {
				res.cookie("token", token, {httpOnly: true});
			} else {
				res.clearCookie("token");
			};

			res.status(200).json({"status": "success", "statuscode": 200, "data": {
																				   "result": "you are now logged in.", 
																				   "userid": data.userid, 
																				   "username": data.username, 
																				   "email": data.email,
																				   "roleid": data.roleid,
																				   "token": token
																				   }
		    });
		});
	});
});

// POST for new users to register / signup
router.post('/auth/register', checkIfTablesAreEmpty, registerValidationAndErrorHandling, async (req, res, next) => {
				
	// #swagger.tags = ['Login & Registration']
	// #swagger.description = "<h3>Registers a new user (and creates a new cart) based on validated parameters provided in the request's body.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/newUserRegister"
		}
	}
	*/

  const {username, email, password, firstname, lastname, address, telephonenumber} = req.body;
	var salt = crypto.randomBytes(16);
	crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
		if(err) { return next(err); }
		await userService.create(username, email, hashedPassword, salt, firstname, lastname, address, telephonenumber);
		let newUser = await userService.getOne(username, email);
		let userid = newUser.userid;
		await cartService.create(userid, 1);
		return res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "you created an account."}});
	});
});

// GET for admins to get the user list
router.get('/users', isAuth, isAdmin, async (req, res, next) => {
			
	// #swagger.tags = ['The User Table Endpoints']
	// #swagger.description = "<h3>Gets the user list if user is authorized and admin. (If user id is present in the request's body, then returns only the user, if found. Not the whole user list. Not demonstrated here!)</h3>"
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {userid} = req.body;
	let users;
	if (userid != null) {
		users = await userService.getOneByUserId(userid);
	} else {
		users = await userService.getAllRawSql();
	};

    if(users.length === 0) {
      return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there are NO users!", "user": users}});
    };

    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "users found.", "user": users}});
});

// PUT for admins to change a user
router.put('/users', isAuth, isAdmin, userUpdate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The User Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, changes a user based on validated parameters provided in the request's body.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/userChange"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {userid, firstname, lastname, address, telephonenumber, roleid} = req.body;

    await userService.update(userid, firstname, lastname, address, telephonenumber, roleid);
    let updatedUser = await userService.getOneByUserId(userid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "user's updated!", "user": updatedUser}});
});

// DELETE for admins to remove a user
router.delete('/users', isAuth, isAdmin, userDelete, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The User Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, removes a user based on validated parameters provided in the request's body. This happens only if user to be removed is not admin and has no carts or orders.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/userDelete"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {userid} = req.body;

    let removedUser = await userService.getOneByUserId(userid);

    await userService.delete(userid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "user's deleted!", "user": removedUser}});
});

module.exports = router;