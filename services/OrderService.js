class OrderService {
    constructor(db) {
        this.client = db.sequelize;
        this.Order = db.Order;
    };

    async getOneByStatus(orderstatusid) {
        return this.Order.findOne({
            where: {
                orderstatusid: orderstatusid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByUser(userid) {
        return this.Order.findOne({
            where: {
                userid: userid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllInProgressOrders(userid) {
        return this.Order.findAll({
            where: {
                userid: userid,
                orderstatusid: 1
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllOrderedOrders(userid) {
        return this.Order.findAll({
            where: {
                userid: userid,
                orderstatusid: 2
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllCompletedOrders(userid) {
        return this.Order.findAll({
            where: {
                userid: userid,
                orderstatusid: 3
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllByUser(userid) {
        return this.Order.findAll({
            where: {
                userid: userid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByOrderNumber(ordernumber) {
        return this.Order.findOne({
            where: {
                ordernumber: ordernumber
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAll() {
        return this.Order.findAll({
            where: {}
        }).catch(function (err) {
            console.log(err);
        });
    };

    async create(ordernumber, userid, membershipid, total) {
        return this.Order.create(
            {
                ordernumber: ordernumber,
                userid: userid,
                membershipid: membershipid,
                total: total
            }
        ).catch(function (err) {
            console.log(err);
        });
    };
    
    async updateStatus(ordernumber, orderstatusid) {
        return this.Order.update(
        {
            orderstatusid: orderstatusid
        },
        {
            where: {
                ordernumber: ordernumber
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

};

module.exports = OrderService;