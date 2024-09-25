var express = require('express');
var router = express.Router();

var db = require('../models');
var RoleService = require('../services/RoleService');
var roleService = new RoleService(db);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const { checkIfTablesAreEmpty, isAuth, isAdmin, roleCreate, roleUpdate, roleDelete } = require('../middleware/middleware');

// GET to get the list of roles
router.get('/', async (req, res, next) => {
				
	// #swagger.tags = ['The Role Table Endpoints']
	// #swagger.description = "<h3>Gets the role list.</h3>"

    const roles = await roleService.getAll();

    if(roles.length === 0) {
      return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there are NO roles!", "role": roles}});
    };

    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "roles found.", "role": roles}});
});

// POST for admins to create a new role
router.post('/', checkIfTablesAreEmpty, isAuth, isAdmin, roleCreate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Role Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, creates a role based on validated parameters provided in the request's body.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/roleCreate"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {role} = req.body;

    await roleService.create(role);
    let newRole = await roleService.getOneByName(role);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "a new role's created!", "role": newRole}});
});

// PUT for admins to change an existing role
router.put('/', isAuth, isAdmin, roleUpdate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Role Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, changes a role based on validated parameters provided in the request's body. This only happens if it is not a default role.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/roleChange"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {roleid, role} = req.body;

    await roleService.update(roleid, role);
    let updatedRole = await roleService.getOneById(roleid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "role's updated!", "role": updatedRole}});
});

// DELETE for admins to remove an existing role
router.delete('/', isAuth, isAdmin, roleDelete, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Role Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, removes a role based on validated parameters provided in the request's body. This happens only if it is not a default role or no users have it.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/roleDelete"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {roleid} = req.body;

    let removedRole = await roleService.getOneById(roleid);
    if (removedRole == null) {
        return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such role associated with given roleid!"}});
    };

    await roleService.delete(roleid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "role's deleted!", "role": removedRole}});
});
  
module.exports = router;