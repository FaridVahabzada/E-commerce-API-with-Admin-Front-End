class MembershipService {
    constructor(db) {
        this.client = db.sequelize;
        this.Membership = db.Membership;
    };

    async getOneByName(membership) {
        return this.Membership.findOne({
            where: {
                membership: membership
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneById(membershipid) {
        return this.Membership.findOne({
            where: {
                membershipid: membershipid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    
    async getAll() {
        return this.Membership.findAll({
            where: {}
        }).catch(function (err) {
            console.log(err);
        });
    };

    async create(membership, discount) {
        return this.Membership.create(
            {
                membership: membership,
                discount: discount
            }
        ).catch(function (err) {
            console.log(err);
        });
    };
    
    async update(membershipid, membership, discount) {
        return this.Membership.update(
        {
            membership: membership,
            discount: discount
        },
        {
            where: {
                membershipid: membershipid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async delete(membershipid) {
        return this.Membership.destroy({
            where: {
                membershipid: membershipid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

};

module.exports = MembershipService;