class CartItemService {
    constructor(db) {
        this.client = db.sequelize;
        this.CartItem = db.CartItem;
        this.Cart = db.Cart;
    };

    async getPassivesByProduct(productid) {
        return this.CartItem.findAll({
            where: {
                productid: productid
            },
            include: [{
                model: this.Cart,
                where: {isCheckedOut: 1}
            }]
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getActivesByProduct(productid) {
        return this.CartItem.findAll({
            where: {
                productid: productid
            },
            include: [{
                model: this.Cart,
                where: {isCheckedOut: 0}
            }]
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllByCartJoin(cartid) {
        return this.CartItem.findAll({
            where: {
                cartid: cartid
            },
            include: [{
                model: this.Cart
            }]
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllByCart(cartid) {
        return this.CartItem.findAll({
            where: {
                cartid: cartid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByProductAndCart(cartid, productid) {
        return this.CartItem.findOne({
            where: {
                cartid: cartid,
                productid: productid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByCartItemId(cartitemid) {
        return this.CartItem.findOne({
            where: {
                cartitemid: cartitemid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAll() {
        return this.CartItem.findAll({
            where: {}
        }).catch(function (err) {
            console.log(err);
        });
    };

    async create(cartid, productid, cartitemquantity, unitprice) {
        return this.CartItem.create(
            {
                cartid: cartid,
                productid: productid,
                cartitemquantity: cartitemquantity,
                unitprice: unitprice
            }
        ).catch(function (err) {
            console.log(err);
        });
    };
    
    async updateQuantity(cartid, productid, cartitemquantity) {
        return this.CartItem.update(
        {
            cartitemquantity: cartitemquantity
        },
        {
            where: {
                cartid: cartid,
                productid: productid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    
    async updateUnitPrice(cartid, productid, unitprice) {
        return this.CartItem.update(
        {
            unitprice: unitprice
        },
        {
            where: {
                cartid: cartid,
                productid: productid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async deleteByCartAndProduct(cartid, productid) {
        return this.CartItem.destroy({
            where: {
                cartid: cartid,
                productid: productid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async deleteByCartItemId(cartitemid) {
        return this.CartItem.destroy({
            where: {
                cartitemid: cartitemid            }
        }).catch(function (err) {
            console.log(err);
        });
    };

};

module.exports = CartItemService;