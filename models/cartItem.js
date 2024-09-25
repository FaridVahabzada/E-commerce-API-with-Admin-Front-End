module.exports = (sequelize, Sequelize) => {
	const CartItem = sequelize.define(
		'CartItem',
		{
            cartitemid: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true
            },

            cartid: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false
            },

            productid: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false
            },

            cartitemquantity: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false/*,
                defaultValue: 0*/
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

	CartItem.associate = function (models) {
        CartItem.belongsTo(models.Cart, { foreignKey: 'cartid' });
        CartItem.belongsTo(models.Product, { foreignKey: 'productid' });
		//CartItem.hasOne(models.OrderItem, { foreignKey: 'cartitemid' });
	};

	return CartItem;
};