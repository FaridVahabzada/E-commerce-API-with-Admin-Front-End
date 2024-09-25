module.exports = (sequelize, Sequelize) => {
	const Order = sequelize.define(
		'Order',
		{
            orderid: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true
            },

            ordernumber: {
                type: Sequelize.DataTypes.STRING(8),
                allowNull: false,
                unique: true
            },

            userid: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false
            },

            /*cartid: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                unique: true
            },*/

			membershipid: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false
			},

			total: {
				type: Sequelize.DataTypes.FLOAT,
                allowNull: false
			},

            orderstatusid: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                defaultValue: 1
            },

            createdAt: {
                type: 'TIMESTAMP',
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },

            updatedAt: {
                type: 'TIMESTAMP',
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
            }

		},
		{
			timestamps: true,
		}
	);

	Order.associate = function (models) {
        Order.belongsTo(models.User, { foreignKey: 'userid' });
        Order.belongsTo(models.Membership, { foreignKey: 'membershipid' });
        Order.belongsTo(models.OrderStatus, { foreignKey: 'orderstatusid' });
		Order.hasMany(models.OrderItem, { sourceKey: 'ordernumber', foreignKey: 'ordernumber' });
        //Order.belongsTo(models.Cart, { foreignKey: 'cartid' });
	};

	return Order;
};