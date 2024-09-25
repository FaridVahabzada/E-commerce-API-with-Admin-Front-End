const db = require('../models');
var UserService = require('../services/UserService');
var userService = new UserService(db);
var BrandService = require('../services/BrandService');
var brandService = new BrandService(db);
var CategoryService = require('../services/CategoryService');
var categoryService = new CategoryService(db);
var ProductService = require('../services/ProductService');
var productService = new ProductService(db);
var RoleService = require('../services/RoleService');
var roleService = new RoleService(db);
var MembershipService = require('../services/MembershipService');
var membershipService = new MembershipService(db);
var OrderStatusService = require('../services/OrderStatusService');
var orderStatusService = new OrderStatusService(db);
var CartService = require('../services/CartService');
var cartService = new CartService(db);
var CartItemService = require('../services/CartItemService');
var cartItemService = new CartItemService(db);
var OrderService = require('../services/OrderService');
var orderService = new OrderService(db);
var OrderItemService = require('../services/OrderItemService');
var orderItemService = new OrderItemService(db);

var jwt = require('jsonwebtoken');

const axios = require('axios');

var crypto = require('crypto');

const categoryUpdateSchema = require('../json_schema/categoryUpdate');
const brandCreateSchema = require('../json_schema/brandCreate');
const brandUpdateSchema = require('../json_schema/brandUpdate');
const brandDeleteSchema = require('../json_schema/brandDelete');
const roleCreateSchema = require('../json_schema/roleCreate');
const roleUpdateSchema = require('../json_schema/roleUpdate');
const roleDeleteSchema = require('../json_schema/roleDelete');
const membershipCreateSchema = require('../json_schema/membershipCreate');
const membershipUpdateSchema = require('../json_schema/membershipUpdate');
const membershipDeleteSchema = require('../json_schema/membershipDelete');
const loginSchema = require('../json_schema/login');
const registerSchema = require('../json_schema/register');
const userUpdateSchema = require('../json_schema/userUpdate');
const userDeleteSchema = require('../json_schema/userDelete');
const productCreateSchema = require('../json_schema/productCreate');
const productUpdateSchema = require('../json_schema/productUpdate');
const productDeleteSchema = require('../json_schema/productDelete');
const cartItemCreateSchema = require('../json_schema/cartItemCreate');
const cartItemUpdateSchema = require('../json_schema/cartItemUpdate');
const cartItemDeleteSchema = require('../json_schema/cartItemDelete');
const orderUpdateSchema = require('../json_schema/orderUpdate');
const orderStatusCreateSchema = require('../json_schema/orderStatusCreate');
const orderStatusUpdateSchema = require('../json_schema/orderStatusUpdate');
const orderStatusDeleteSchema = require('../json_schema/orderStatusDelete');
const searchSchema = require('../json_schema/search');

const Ajv = require('ajv');
const addFormats = require("ajv-formats");
const ajv = new Ajv();
addFormats(ajv);

module.exports = {

	checkIfDatabasePopulated: async function(req, res, next) {
		let roles = await roleService.getAll();
		let brands = await brandService.getAll();
		let categories = await categoryService.getAll();
		let orderStatuses = await orderStatusService.getAll();
		let memberships = await membershipService.getAll();
		let products;

		if (roles.length === 0 && brands.length === 0 && categories.length === 0 && orderStatuses.length === 0 && memberships.length === 0) {
			
			await axios.get("http://backend.restapi.co.za/items/products").then( async (response) => {
				products = response.data.data;
				
				let Brands = [...new Set(products.map(({brand}) => brand))];
				for (i = 0; i < Brands.length; i++) {
					await brandService.create(
						Brands[i]
					);
				};

				let Categories = [...new Set(products.map(({category}) => category))];
				for (i = 0; i < Categories.length; i++) {
					await categoryService.create(
						Categories[i]
					);
				};

			});

			for (i = 0; i < products.length; i++) {
				let brand = await brandService.getOneByName(products[i].brand);
				let category = await categoryService.getOneByName(products[i].category);
				await productService.create(
					products[i].name,
					products[i].description,
					products[i].price,
					products[i].imgurl,
					products[i].quantity,
					brand.brandid,
					category.categoryid
				);
			};

			["Admin", "User"].forEach(role => roleService.create(role));

			const memberships = [{"name": "Bronze", "discount": 0}, {"name": "Silver", "discount": 15}, {"name": "Gold", "discount": 30}]
			for(let membership of memberships) { await membershipService.create(membership.name, membership.discount);};

			["In Progress", "Ordered", "Completed"].forEach(orderStatus => orderStatusService.create(orderStatus));

			const salt = crypto.randomBytes(16);
			crypto.pbkdf2("P@ssword2023", salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
				if(err) { return next(err); }
				await userService.createAdmin("Admin", "admin@noroff.no", hashedPassword, salt, "Admin", "Support", "Online", "911", 1);
				await cartService.create(1, 1);
			});
		} else {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no records added, the database is already populated!"}});
		};
		

		next();
	},

	checkIfTablesAreEmpty: async function(req, res, next) {
		let roles = await roleService.getAll();
		let brands = await brandService.getAll();
		let categories = await categoryService.getAll();
		let orderStatuses = await orderStatusService.getAll();
		let memberships = await membershipService.getAll();

		if (roles.length === 0 || brands.length === 0 || categories.length === 0 || orderStatuses.length === 0 || memberships.length === 0) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no records're added, the database needs inital populating!"}});
		};

		next();
	},

	isAuth: async function(req, res, next) {
		const token = req.headers.authorization?.split(' ')[1];
		
		if(!token) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "JWT token not provided!"}});
		}
		
		let decodedToken;
		try {
			decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
		}
		catch(err) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": "JWT token verification went wrong!", "error message": err.message}});
		};

		let userid = decodedToken.userid;
		let userTableEmpty = await userService.getOneByUserId(userid);
		if (userTableEmpty == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such user associated with given token!"}});
		};

		next();
	},

    isAdmin: async function(req, res, next) {
		const token = req.headers.authorization?.split(' ')[1];
		let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

		let userid = decodedToken.userid;
		let userTableEmpty = await userService.getOneByUserId(userid);
		if (userTableEmpty == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such user associated with given token!"}});
		};

		let roleid = userTableEmpty.roleid;
		if (roleid !== 1) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "access denied! only admins!"}});
		};
		
		next();
    },

	registerValidationAndErrorHandling: async function(req, res, next) {
		const userToRegister = req.body;
		const username = userToRegister.username;
		const email = userToRegister.email;

		const validate = ajv.compile(registerSchema);
		const valid = validate(userToRegister);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};

		var userByUsername = await userService.getOneByUsername(username);
		if (userByUsername != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "provided username is associated with another user!"}});
		};

		var userByEmail = await userService.getOneByEmail(email);
		if (userByEmail != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "provided email is associated with another user!"}});
		};

		next();
	},

	loginValidationAndErrorHandling: async function(req, res, next) {
		const userToLogin = req.body;
		const username = userToLogin.username;
		const email = userToLogin.email;

		if (username == null && email == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "please, provide a username or an email!"}});
		};
		if (username != null && email != null) {
			const validUser = await userService.getAllByUserAndEmail(username, email);
			if(Object.keys(validUser).length > 1 || Object.keys(validUser).length === 0) {
				return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no user is associated with both username and email!"}});
			};
		};

		const validate = ajv.compile(loginSchema);
		const valid = validate(userToLogin);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		var user = await userService.getOne(username, email);
		if (user == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there exists no such user with provided credentials!"}});
		};

		next();
	},

	userUpdate: async function(req, res, next) {
		const userToUpdate = req.body;
		const validate = ajv.compile(userUpdateSchema);
		const valid = validate(userToUpdate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};

		let userId = userToUpdate.userid;
		let checkById = await userService.getOneByUserId(userId);
		if (checkById == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such user associated with given userid!"}});
		};
		
		next();

	},

	userDelete: async function(req, res, next) {
		const userToDelete = req.body;
		const validate = ajv.compile(userDeleteSchema);
		const valid = validate(userToDelete);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};

		let removedUser = await userService.getOneByUserId(userToDelete.userid);
		if (removedUser == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such user associated with given userid!"}});
		};
	
		if (removedUser.roleid === 1) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "You canNOT delete the admin users!"}});
		};
		
		const cartWithUser = await cartService.getOneByUser(userToDelete.userid);
		const orderWithUser = await orderService.getOneByUser(userToDelete.userid);
		if (cartWithUser != null || orderWithUser != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "cannot remove the user! there exists one or more carts / orders related to this user!"}});
		};
		
		next();

	},

	categoryUpdate: async function(req, res, next) {
		const categoryToUpdate = req.body;
		const validate = ajv.compile(categoryUpdateSchema);
		const valid = validate(categoryToUpdate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
	
		let checkById = await categoryService.getOneById(categoryToUpdate.categoryid);
		if (checkById == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such category associated with given categoryid!"}});
		};
		
		let checkByName = await categoryService.getOneByName(categoryToUpdate.category);
		if (checkByName != null && checkByName.categoryid !== categoryToUpdate.categoryid) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there already exists such category!"}});
		};
		
		next();

	},

	categoryDelete: async function(req, res, next) {
		const {categoryid} = req.body;

		if (categoryid == null) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": "categoryid is required! it cannot be null / undefined!"}});
		};
		
		if (!Number.isInteger(categoryid) || categoryid === 0) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": `${Object.keys({categoryid})[0]} must be an integer and greater than 0! NO strings!`}});
		};
		
		const productWithCategory = await productService.getOneByCategory(categoryid);
	
		if (productWithCategory != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "cannot remove the category! there exists one or more products related to this category!"}});
		};
		
		next();

	},

	brandCreate: async function(req, res, next) {
		const brandToCreate = req.body;
		const validate = ajv.compile(brandCreateSchema);
		const valid = validate(brandToCreate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		let checkByName = await brandService.getOneByName(brandToCreate.brand);
		if (checkByName != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there already exists such brand!"}});
		};
		
		next();

	},

	brandUpdate: async function(req, res, next) {
		const brandToUpdate = req.body;
		const validate = ajv.compile(brandUpdateSchema);
		const valid = validate(brandToUpdate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		let checkById = await brandService.getOneById(brandToUpdate.brandid);
		if (checkById == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such brand associated with given brand id!"}});
		};
		
		let checkByName = await brandService.getOneByName(brandToUpdate.brand);
		if (checkByName != null && checkByName.brandid !== brandToUpdate.brandid) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there already exists such brand!"}});
		};
		
		next();

	},

	brandDelete: async function(req, res, next) {
		const brandToDelete = req.body;
		const validate = ajv.compile(brandDeleteSchema);
		const valid = validate(brandToDelete);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		const productWithBrand = await productService.getOneByBrand(brandToDelete.brandid);
	
		if (productWithBrand != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "cannot remove the brand! there exists one or more products related to this brand!"}});
		};
		
		next();

	},

	roleCreate: async function(req, res, next) {
		const roleToCreate = req.body;
		const validate = ajv.compile(roleCreateSchema);
		const valid = validate(roleToCreate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		let checkByName = await roleService.getOneByName(roleToCreate.role);
		if (checkByName != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there already exists such role!"}});
		};
		
		next();

	},

	roleUpdate: async function(req, res, next) {
		const roleToUpdate = req.body;
		const validate = ajv.compile(roleUpdateSchema);
		const valid = validate(roleToUpdate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};

		let roleId = roleToUpdate.roleid;
		let checkById = await roleService.getOneById(roleId);
		if (checkById == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such role associated with given roleid!"}});
		};
		
		if (roleId === 1 || roleId === 2) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "You canNOT change the default roles!"}});
		};
		
		let checkByName = await roleService.getOneByName(roleToUpdate.role);
		if (checkByName != null && checkByName.roleid !== roleId) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there already exists such role!"}});
		};

		next();

	},

	roleDelete: async function(req, res, next) {
		const roleToDelete = req.body;
		const validate = ajv.compile(roleDeleteSchema);
		const valid = validate(roleToDelete);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		let roleId = roleToDelete.roleid;
		if (roleId === 1 || roleId === 2) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "You canNOT delete the default roles!"}});
		};
		
		const userWithRole = await userService.getOneByRole(roleId);
		if (userWithRole != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "cannot remove the role! there exists one or more users related to this role!"}});
		};
		
		next();

	},

	orderStatusCreate: async function(req, res, next) {
		const orderStatusToCreate = req.body;
		const validate = ajv.compile(orderStatusCreateSchema);
		const valid = validate(orderStatusToCreate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		let checkByName = await orderStatusService.getOneByName(orderStatusToCreate.orderstatus);
		if (checkByName != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there already exists such order status!"}});
		};
		
		next();

	},

	orderStatusUpdate: async function(req, res, next) {
		const orderStatusToUpdate = req.body;
		const validate = ajv.compile(orderStatusUpdateSchema);
		const valid = validate(orderStatusToUpdate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};

		let orderStatusId = orderStatusToUpdate.orderstatusid;
		let checkById = await orderStatusService.getOneById(orderStatusId);
		if (checkById == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such order status associated with given orderstatusid!"}});
		};
		
		if (orderStatusId === 1 || orderStatusId === 2 || orderStatusId === 3) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "You canNOT change the default order statuses!"}});
		};
		
		let checkByName = await orderStatusService.getOneByName(orderStatusToUpdate.orderstatus);
		if (checkByName != null && checkByName.orderstatusid !== orderStatusId) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there already exists such order status!"}});
		};

		next();

	},

	orderStatusDelete: async function(req, res, next) {
		const orderStatusToDelete = req.body;
		const validate = ajv.compile(orderStatusDeleteSchema);
		const valid = validate(orderStatusToDelete);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		let orderStatusId = orderStatusToDelete.orderstatusid;
		if (orderStatusId === 1 || orderStatusId === 2 || orderStatusId === 3) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "You canNOT delete the default order statuses!"}});
		};
		
		const orderWithStatus = await orderService.getOneByStatus(orderStatusId);
	
		if (orderWithStatus != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "cannot remove the order status! there exists one or more orders related to this order status!"}});
		};
		
		next();

	},

	membershipCreate: async function(req, res, next) {
		const membershipToCreate = req.body;
		const validate = ajv.compile(membershipCreateSchema);
		const valid = validate(membershipToCreate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		let checkByName = await membershipService.getOneByName(membershipToCreate.membership);
		if (checkByName != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there already exists such membership!"}});
		};
		
		next();

	},

	membershipUpdate: async function(req, res, next) {
		const membershipToUpdate = req.body;
		const validate = ajv.compile(membershipUpdateSchema);
		const valid = validate(membershipToUpdate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		let membershipId = membershipToUpdate.membershipid;
		let checkById = await membershipService.getOneById(membershipId);
		if (checkById == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such membership associated with given membershipid!"}});
		};
		
		if (membershipId === 1 || membershipId === 2 || membershipId === 3) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "You canNOT change the default memberships!"}});
		};
		
		let checkByName = await membershipService.getOneByName(membershipToUpdate.membership);
		if (checkByName != null && checkByName.membershipid !== membershipId) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there already exists such membership!"}});
		};
		
		next();

	},

	membershipDelete: async function(req, res, next) {
		const membershipToDelete = req.body;
		const validate = ajv.compile(membershipDeleteSchema);
		const valid = validate(membershipToDelete);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		const userWithMembership = await userService.getOneByMembership(membershipToDelete.membershipid);
	
		if (userWithMembership != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "cannot remove the membership! there exists one or more users related to this membership!"}});
		};
		
		next();

	},

	productCreate: async function(req, res, next) {
		const productToCreate = req.body;
		const validate = ajv.compile(productCreateSchema);
		const valid = validate(productToCreate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		let checkByName = await productService.getOneByProduct(productToCreate.product);
		if (checkByName != null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there already exists such product!"}});
		};
		
		let existingBrand = await brandService.getOneById(productToCreate.brandid);
		if (existingBrand == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such brand associated with given brandid!"}});
		};
		
		let existingCategory = await categoryService.getOneById(productToCreate.categoryid);
		if (existingCategory == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such category associated with given categoryid!"}});
		};

		next();

	},

	productUpdate: async function(req, res, next) {
		const productToUpdate = req.body;
		const validate = ajv.compile(productUpdateSchema);
		const valid = validate(productToUpdate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};

		let checkById = await productService.getOneByProductId(productToUpdate.productid);
		if (checkById == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such product associated with given productid!"}});
		};
		
		let checkByName = await productService.getOneByProduct(productToUpdate.product);
		if (checkByName != null && checkByName.productid !== productToUpdate.productid) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there already exists such product!"}});
		};
		
		let existingBrand = await brandService.getOneById(productToUpdate.brandid);
		if (existingBrand == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such brand associated with given brandid!"}});
		};
		
		let existingCategory = await categoryService.getOneById(productToUpdate.categoryid);
		if (existingCategory == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such category associated with given categoryid!"}});
		};

		let activeCartItems = await cartItemService.getActivesByProduct(productToUpdate.productid);
		if(activeCartItems != null) {
			for (i = 0; i < Object.keys(activeCartItems).length; i++) {
				await cartItemService.updateUnitPrice(activeCartItems[i].cartid, activeCartItems[i].productid, productToUpdate.unitprice);
			};
			if(productToUpdate.isdeleted === 1) {
				for (i = 0; i < Object.keys(activeCartItems).length; i++) {
					await cartItemService.deleteByCartAndProduct(activeCartItems[i].cartid, activeCartItems[i].productid);
				};
			};
			if(productToUpdate.quantity === 0) {
				for (i = 0; i < Object.keys(activeCartItems).length; i++) {
					await cartItemService.deleteByCartAndProduct(activeCartItems[i].cartid, activeCartItems[i].productid);
				};
			};
		};
		
		next();

	},

	productDelete: async function(req, res, next) {
		const productToDelete = req.body;
		const validate = ajv.compile(productDeleteSchema);
		const valid = validate(productToDelete);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};

		let removedProduct = await productService.getOneByProductId(productToDelete.productid);
		if (removedProduct == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such product associated with given productid!"}});
		};

		let activeCartItems = await cartItemService.getActivesByProduct(productToDelete.productid);
		if(activeCartItems != null) {
			for (i = 0; i < Object.keys(activeCartItems).length; i++) {
				await cartItemService.deleteByCartAndProduct(activeCartItems[i].cartid, activeCartItems[i].productid);
			};
		};

		next();

	},

	cartItemCreate: async function(req, res, next) {
		const cartItemToCreate = req.body;
		const validate = ajv.compile(cartItemCreateSchema);
		const valid = validate(cartItemToCreate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};

		const token = req.headers.authorization?.split(' ')[1];
		let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

		let userid = decodedToken.userid;
		let userTableEmpty = await userService.getOneByUserId(userid)
		if (userTableEmpty == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such user associated with given token!"}});
		};
		
		const productid = cartItemToCreate.productid;
		const quantity = cartItemToCreate.quantity;

		let existingProduct = await productService.getOneByProductId(productid);
		if (existingProduct == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such product associated with given productid!"}});
		};

		let isRemoved = existingProduct.isdeleted;

		let activeCart = await cartService.getActiveCart(userid);
		let cartid = activeCart.cartid;

		let membershipid = userTableEmpty.membershipid;
		let membership = await membershipService.getOneById(membershipid);
		let discount = membership.discount;
		async function updateTotal() {
			let total = 0;
			let allCartItems = await cartItemService.getAllByCartJoin(cartid);
			for (i = 0; i < Object.keys(allCartItems).length; i++) {
				let productCost = allCartItems[i].unitprice * allCartItems[i].cartitemquantity;
				total += (productCost - ((productCost * discount) / 100));
			};
			await cartService.updateTotal(cartid, total);
		};

		let duplicateCartItem = await cartItemService.getOneByProductAndCart(cartid, productid);

		if (isRemoved == 1) {
			if (duplicateCartItem != null) {
				await cartItemService.deleteByCartAndProduct(cartid, productid);
			};
			await updateTotal();
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "this product is not available for purchasing!"}});
		};

		let productUnitPrice = existingProduct.unitprice;
		let isEnough = existingProduct.quantity;

		if (duplicateCartItem != null) {
			let duplicateCartItemQuantity = duplicateCartItem.cartitemquantity;
			let newQuantity = duplicateCartItemQuantity + quantity;
			if(isEnough < newQuantity) {
				if(isEnough === 0) {
					await cartItemService.deleteByCartAndProduct(cartid, productid);
					await updateTotal();
					return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": `only ${isEnough} units of this product is available! with already ${duplicateCartItemQuantity} in the cart and ${quantity} added now, you want to get ${newQuantity} units! you cannot buy this product!`}});
				} else if(isEnough < duplicateCartItemQuantity) {
					await cartItemService.updateQuantity(cartid, productid, isEnough);
					await updateTotal();
					return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": `only ${isEnough} units of this product is available! with already ${duplicateCartItemQuantity} in the cart and ${quantity} added now, you want to get ${newQuantity} units! it's been set to ${isEnough}!`}});
				} else {
					return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": `only ${isEnough} units of this product is available! with already ${duplicateCartItemQuantity} in the cart and ${quantity} added now, you want to get ${newQuantity} units!`}});
				};
			} else {
				await cartItemService.updateQuantity(cartid, productid, newQuantity);
			};
		} else {
			if (isEnough < quantity) {
				return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": `only ${isEnough} units of this product is available!`}});
			} else {
				await cartItemService.create(cartid, productid, quantity, productUnitPrice);
			};
		};

		await updateTotal();
		
		next();

	},

	cartItemUpdate: async function(req, res, next) {
		const cartItemToUpdate = req.body;
		const validate = ajv.compile(cartItemUpdateSchema);
		const valid = validate(cartItemToUpdate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};

		const token = req.headers.authorization?.split(' ')[1];
		let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

		let userid = decodedToken.userid;
		let userTableEmpty = await userService.getOneByUserId(userid)
		if (userTableEmpty == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such user associated with given token!"}});
		};
		
		const cartitemid = cartItemToUpdate.cartitemid;
		const quantity = cartItemToUpdate.quantity;

		const cartItem = await cartItemService.getOneByCartItemId(cartitemid);
		if (cartItem == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such cart item associated with given cart item id!"}});
		};

		let productid = cartItem.productid;
		let existingProduct = await productService.getOneByProductId(productid);
		let isRemoved = existingProduct.isdeleted;

		let activeCart = await cartService.getActiveCart(userid);
		let cartid = activeCart.cartid;
		
		let cartIdItem = cartItem.cartid;
		if (cartIdItem !== cartid) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "this cart item id is not associated with any ACTIVE carts of this user! after check-out no changes can be made!"}});
		};

		let membershipid = userTableEmpty.membershipid;
		let membership = await membershipService.getOneById(membershipid);
		let discount = membership.discount;
		async function updateTotal() {
			let total = 0;
			let allCartItems = await cartItemService.getAllByCartJoin(cartid);
			for (i = 0; i < Object.keys(allCartItems).length; i++) {
				let productCost = allCartItems[i].unitprice * allCartItems[i].cartitemquantity;
				total += (productCost - ((productCost * discount) / 100));
			};
			await cartService.updateTotal(cartid, total);
		};

		if (isRemoved == 1) {
			await updateTotal();
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "product associated with this cart item id is not available for purchasing!"}});
		};

		let isEnough = existingProduct.quantity;
		if (isEnough === 0) {
			await cartItemService.deleteByCartAndProduct(cartIdItem, productid);
			await updateTotal();
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": `only ${isEnough} units of this product is available! cart item's deleted now!`}});
		} else if (isEnough < quantity) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": `only ${isEnough} units of this product is available!`}});
		} else {
			await cartItemService.updateQuantity(cartIdItem, productid, quantity);
		};

		await updateTotal();
		
		next();

	},

	cartItemDelete: async function(req, res, next) {
		const cartItemToDelete = req.body;
		const validate = ajv.compile(cartItemDeleteSchema);
		const valid = validate(cartItemToDelete);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};

		const token = req.headers.authorization?.split(' ')[1];
		let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

		let userid = decodedToken.userid;
		let userTableEmpty = await userService.getOneByUserId(userid)
		if (userTableEmpty == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such user associated with given token!"}});
		};
		
		const cartitemid = cartItemToDelete.cartitemid;

		const cartItem = await cartItemService.getOneByCartItemId(cartitemid);
		if (cartItem == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such cart item associated with given cart item id!"}});
		};

		let activeCart = await cartService.getActiveCart(userid);
		let cartid = activeCart.cartid;

		
		let cartIdItem = cartItem.cartid;
		if (cartIdItem !== cartid) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "this cart item id is not associated with the ACTIVE cart of this user! after check-out no changes can be made!"}});
		};

		next();

	},

	cartItemCheckOut: async function(req, res, next) {
		const token = req.headers.authorization?.split(' ')[1];
		let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

		let userid = decodedToken.userid;
		let userTableEmpty = await userService.getOneByUserId(userid);
		if (userTableEmpty == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such user associated with given token!"}});
		};

		let activeCart = await cartService.getActiveCart(userid);
		let cartid = activeCart.cartid;
		let cartItems = await cartItemService.getAllByCartJoin(cartid);

		if(cartItems.length === 0) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "this cart got no items in it! you canNOT check out with an empthy cart!"}});
		};

		let membershipid = userTableEmpty.membershipid;
		let membership = await membershipService.getOneById(membershipid);
		let discount = membership.discount;
		async function updateTotal() {
			let total = 0;
			let allCartItems = await cartItemService.getAllByCartJoin(cartid);
			for (i = 0; i < Object.keys(allCartItems).length; i++) {
				let productCost = allCartItems[i].unitprice * allCartItems[i].cartitemquantity;
				total += (productCost - ((productCost * discount) / 100));
			};
			await cartService.updateTotal(cartid, total);
		};

		for (i = 0; i < Object.keys(cartItems).length; i++) {
			let product = await productService.getOneByProductId(cartItems[i].productid);
			let isEnough = product.quantity;
			if (isEnough === 0) {
				await cartItemService.deleteByCartAndProduct(cartItems[i].cartid, cartItems[i].productid);
				await updateTotal();
				return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": `only ${isEnough} units of the product (${product.product}) with product id of ${product.productid} is available! cart item's deleted now!`}});
			};
		};

		for (i = 0; i < Object.keys(cartItems).length; i++) {
			let product = await productService.getOneByProductId(cartItems[i].productid);
			let quantity = cartItems[i].cartitemquantity;
			let isEnough = product.quantity;
			if (isEnough < quantity) {
				await updateTotal();
				return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": `only ${isEnough} units of this product (${product.product}) with product id of ${product.productid} is available! Please, change quantity of this product in your active cart before proceeding to check-out!`}});
			};
		};

		await updateTotal();

		next();

	},

	orderUpdate: async function(req, res, next) {
		const orderToUpdate = req.body;
		const validate = ajv.compile(orderUpdateSchema);
		const valid = validate(orderToUpdate);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		let orderNumberToUpdate = orderToUpdate.ordernumber;

		let checkByOrderNumber = await orderService.getOneByOrderNumber(orderNumberToUpdate);
		if (checkByOrderNumber == null) {
			return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such order associated with given order number!"}});
		};
		
		next();

	},

	searchValidation: async function(req, res, next) {
		const productsToSearch = req.body;
		const validate = ajv.compile(searchSchema);
		const valid = validate(productsToSearch);
		if(!valid) {
			return res.status(500).json({"status": "error", "statuscode": 500, "data": {"result": validate.errors}});
		};
		
		next();

	},

	checkTokenValid: async function(req, res, next) {
		const token = req.cookies.token;

		if (token != null) {
			let decodedToken;
			try {
				decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
			} catch (err) {
				res.clearCookie("token");
				return res.redirect("/");
			};

			let userid = decodedToken.userid;
			let user;
		
			await axios.get('http://localhost:3000/users', {
				headers: {
					'Authorization': 'Bearer ' + token
				}
			}, {
				userid: `${userid}`
			})
			.then((response) => {
				user = response.data.data.user;
			})
			.catch(() => {
				user = undefined;
			});

			if (user == null) {
				res.clearCookie("token");
				return res.redirect("/");
			} else if (user.length === 0) {
				res.clearCookie("token");
				return res.redirect("/");
			} else if (user[0].roleid !== 1) {
				res.clearCookie("token");
				return res.redirect("/");
			};
		};
		
		next();

	},

	checkTokenPresent: async function(req, res, next) {
		const token = req.cookies.token;

		if(token == null) { return res.redirect("/");};
		
		next();

	}
};