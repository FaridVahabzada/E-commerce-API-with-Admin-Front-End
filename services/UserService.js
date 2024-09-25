const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize');
const db = require('../models');
class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
    };

    async getOne(username, email) {
        if (email === undefined) {email = null};
        if (username === undefined) {username = null};
        return this.User.findOne({
            where: {
                [Op.or]: {
                    username: username,
                    email: email
                }
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllByUserAndEmail(username, email) {
        return this.User.findAll({
            where: {
                [Op.or]: {
                    username: username,
                    email: email
                }
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    
    async getOneByUsername(username) {
        return this.User.findOne({
            where: {
                username: username
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByEmail(email) {
        return this.User.findOne({
            where: {
                email: email
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByUserId(userid) {
        return this.User.findOne({
            where: {
                userid: userid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByRole(roleid) {
        return this.User.findOne({
            where: {
                roleid: roleid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByMembership(membershipid) {
        return this.User.findOne({
            where: {
                membershipid: membershipid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAll() {
        return this.User.findAll({
            where: {}
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllRawSql() {
        return await db.sequelize.query("SELECT userid, username, email, firstname, lastname, address, telephonenumber, U.roleid, role, U.membershipid, membership FROM Users AS U JOIN Roles AS R ON R.roleid = U.roleid JOIN Memberships AS M ON M.membershipid = U.membershipid GROUP BY U.userid ORDER BY U.userid ASC;", {
            raw: true,
            type: QueryTypes.SELECT
        });
    };

    async create(username, email, password, salt, firstname, lastname, address, telephonenumber) {
        return this.User.create(
            {
                username: username,
                email: email,
                password: password,
                salt: salt,
                firstname: firstname,
                lastname: lastname,
                address: address,
                telephonenumber: telephonenumber
            }
        ).catch(function (err) {
            console.log(err);
        });
    };

    async createAdmin(username, email, password, salt, firstname, lastname, address, telephonenumber, roleid) {
        return this.User.create(
            {
                username: username,
                email: email,
                password: password,
                salt: salt,
                firstname: firstname,
                lastname: lastname,
                address: address,
                telephonenumber: telephonenumber,
                roleid: roleid
            }
        ).catch(function (err) {
            console.log(err);
        });
    };
    
    async update(userid, firstname, lastname, address, telephonenumber, roleid) {
        return this.User.update(
        {
            firstname: firstname,
            lastname: lastname,
            address: address,
            telephonenumber: telephonenumber,
            roleid: roleid
        },
        {
            where: {
                userid: userid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    
    async updateMembership(userid, membershipid) {
        return this.User.update(
        {
            membershipid: membershipid
        },
        {
            where: {
                userid: userid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async delete(userid) {
        return this.User.destroy({
            where: {
                userid: userid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

};

module.exports = UserService;