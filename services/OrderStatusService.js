class OrderStatusService {
    constructor(db) {
        this.client = db.sequelize;
        this.OrderStatus = db.OrderStatus;
    };

    async getOneByName(orderstatus) {
        return this.OrderStatus.findOne({
            where: {
                orderstatus: orderstatus
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneById(orderstatusid) {
        return this.OrderStatus.findOne({
            where: {
                orderstatusid: orderstatusid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    
    async getAll() {
        return this.OrderStatus.findAll({
            where: {}
        }).catch(function (err) {
            console.log(err);
        });
    };

    async create(orderstatus) {
        return this.OrderStatus.create(
            {
                orderstatus: orderstatus
            }
        ).catch(function (err) {
            console.log(err);
        });
    };
    
    async update(orderstatusid, orderstatus) {
        return this.OrderStatus.update(
        {
            orderstatus: orderstatus
        },
        {
            where: {
                orderstatusid: orderstatusid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async delete(orderstatusid) {
        return this.OrderStatus.destroy({
            where: {
                orderstatusid: orderstatusid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

};

module.exports = OrderStatusService;