class CartService {
    constructor(db) {
        this.client = db.sequelize;
        this.Cart = db.Cart;
    };

    async getOneByUser(userid) {
        return this.Cart.findOne({
            where: {
                userid: userid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getActiveCart(userid) {
        return this.Cart.findOne({
            where: {
                userid: userid,
                isCheckedOut: 0
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAll() {
        return this.Cart.findAll({
            where: {}
        }).catch(function (err) {
            console.log(err);
        });
    };

    async create(userid, membershipid) {
        return this.Cart.create(
            {
                userid: userid,
                membershipid: membershipid
            }
        ).catch(function (err) {
            console.log(err);
        });
    };
    
    async updateTotal(cartid, total) {
        return this.Cart.update(
        {
            total: total
        },
        {
            where: {
                cartid: cartid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    
    async softDelete(cartid) {
        return this.Cart.update(
        {
            isCheckedOut: 1
        },
        {
            where: {
                cartid: cartid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

};

module.exports = CartService;