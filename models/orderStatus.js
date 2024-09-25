module.exports = (sequelize, Sequelize) => {
    const OrderStatus = sequelize.define('OrderStatus', {
        orderstatusid: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },

        orderstatus: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        }
        
    }, {
        timestamps: false
    });
    OrderStatus.associate = function(models) {
        OrderStatus.hasMany(models.Order, { foreignKey: 'orderstatusid'});
    };
    
    return OrderStatus;
};