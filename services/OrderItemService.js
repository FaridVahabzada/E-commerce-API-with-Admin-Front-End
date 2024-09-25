class OrderItemService {
    constructor(db) {
        this.client = db.sequelize;
        this.OrderItem = db.OrderItem;
        this.Order = db.Order;
    };

    async getAllInProgressByOrder() {
        return this.OrderItem.findAll({
            where: {},
            include: [{
                model: this.Order,
                where: {orderstatusid: 1}
            }]
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllOrderedByOrder() {
        return this.OrderItem.findAll({
            where: {},
            include: [{
                model: this.Order,
                where: {orderstatusid: 2}
            }]
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllCompletedByOrder() {
        return this.OrderItem.findAll({
            where: {},
            include: [{
                model: this.Order,
                where: {orderstatusid: 3}
            }]
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllByOrderJoin(ordernumber) {
        return this.OrderItem.findAll({
            where: {
                ordernumber: ordernumber
            },
            include: [{
                model: this.Order
            }]
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByProductAndOrder(ordernumber, productid) {
        return this.OrderItem.findOne({
            where: {
                ordernumber: ordernumber,
                productid: productid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByOrderItemId(orderitemid) {
        return this.OrderItem.findOne({
            where: {
                orderitemid: orderitemid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllByOrder(ordernumber) {
        return this.OrderItem.findAll({
            where: {
                ordernumber: ordernumber
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllByUserJoin(userid) {
        return this.OrderItem.findAll({
            where: {},
            include: [{
                model: this.Order,
                where: {userid: userid}
            }]
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAll() {
        return this.OrderItem.findAll({
            where: {}
        }).catch(function (err) {
            console.log(err);
        });
    };

    async create(ordernumber, productid, orderitemquantity, unitprice) {
        return this.OrderItem.create(
            {
                ordernumber: ordernumber,
                productid: productid,
                orderitemquantity: orderitemquantity,
                unitprice: unitprice
            }
        ).catch(function (err) {
            console.log(err);
        });
    };

};

module.exports = OrderItemService;