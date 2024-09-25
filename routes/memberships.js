var express = require('express');
var router = express.Router();

var db = require('../models');
var MembershipService = require('../services/MembershipService');
var membershipService = new MembershipService(db);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const { checkIfTablesAreEmpty, isAuth, isAdmin, membershipCreate, membershipUpdate, membershipDelete } = require('../middleware/middleware');

// GET to get the membership list
router.get('/', async (req, res, next) => {
				
	// #swagger.tags = ['The Membership Table Endpoints']
	// #swagger.description = "<h3>Gets the membership list.</h3>"

    const memberships = await membershipService.getAll();

    if(memberships.length === 0) {
      return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "there are NO memberships!", "membership": memberships}});
    };

    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "memberships found.", "membership": memberships}});
});

// POST for admins to create a new membership
router.post('/', checkIfTablesAreEmpty, isAuth, isAdmin, membershipCreate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Membership Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, creates a membership based on validated parameters provided in the request's body.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/membershipCreate"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {membership, discount} = req.body;

    await membershipService.create(membership, discount);
    let newMembership = await membershipService.getOneByName(membership);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "a new membership's created!", "membership": newMembership}});
});

// PUT for admins to change an existing membership
router.put('/', isAuth, isAdmin, membershipUpdate, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Membership Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, changes a membership based on validated parameters provided in the request's body. This only happens if it is not a default membership.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/membershipChange"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {membershipid, membership, discount} = req.body;

    await membershipService.update(membershipid, membership, discount);
    let updatedMembership = await membershipService.getOneById(membershipid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "membership's updated!", "membership": updatedMembership}});
});

// DELETE for admins to remove an existing membership
router.delete('/', isAuth, isAdmin, membershipDelete, jsonParser, async (req, res, next) => {
				
	// #swagger.tags = ['The Membership Table Endpoints']
	// #swagger.description = "<h3>If user is authorized and admin, removes a membership based on validated parameters provided in the request's body. This happens only if it is not a default membership or there are no users with this membership.</h3>"
	/*
	#swagger.parameters['body'] = {
		"name": "body",
		"in": "body",
		"schema": {
			$ref: "#/definitions/membershipDelete"
		}
	}
	*/
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const {membershipid} = req.body;

    let removedMembership = await membershipService.getOneById(membershipid);
    if (removedMembership == null) {
        return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "no such membership associated with given membershipid!"}});
    };
		
    if (membershipid === 1 || membershipid === 2 || membershipid === 3) {
        return res.status(400).json({"status": "fail", "statuscode": 400, "data": {"result": "You canNOT delete the default memberships!"}});
    };

    await membershipService.delete(membershipid);
    res.status(200).json({"status": "success", "statuscode": 200, "data": {"result": "membership's deleted!", "membership": removedMembership}});
});
  
module.exports = router;