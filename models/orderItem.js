module.exports = (sequelize, Sequelize) => {
	const OrderItem = sequelize.define(
		'OrderItem',
		{
            orderitemid: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true
            },

            ordernumber: {
                type: Sequelize.DataTypes.STRING(8),
                allowNull: false
            },

            /*cartitemid: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                unique: true
            },*/

            productid: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false
            },

            orderitemquantity: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },

            unitprice: {
				type: Sequelize.DataTypes.FLOAT,
				allowNull: false
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

	OrderItem.associate = function (models) {
        OrderItem.belongsTo(models.Order, { foreignKey: 'ordernumber', targetKey: 'ordernumber' });
        OrderItem.belongsTo(models.Product, { foreignKey: 'productid' });
		//OrderItem.belongsTo(models.CartItem,  { foreignKey: 'cartitemid' });
	};

	return OrderItem;
};