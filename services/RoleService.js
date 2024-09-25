class RoleService {
    constructor(db) {
        this.client = db.sequelize;
        this.Role = db.Role;
    };

    async getOneByName(role) {
        return this.Role.findOne({
            where: {
                role: role
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneById(roleid) {
        return this.Role.findOne({
            where: {
                roleid: roleid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    
    async getAll() {
        return this.Role.findAll({
            where: {}
        }).catch(function (err) {
            console.log(err);
        });
    };

    async create(role) {
        return this.Role.create(
            {
                role: role
            }
        ).catch(function (err) {
            console.log(err);
        });
    };
    
    async update(roleid, role) {
        return this.Role.update(
        {
            role: role
        },
        {
            where: {
                roleid: roleid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async delete(roleid) {
        return this.Role.destroy({
            where: {
                roleid: roleid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

};

module.exports = RoleService;