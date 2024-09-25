module.exports = (sequelize, Sequelize) => {
	const Cart = sequelize.define(
		'Cart',
		{
            cartid: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            userid: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },

			membershipid: {
				type: Sequelize.DataTypes.INTEGER,
                allowNull: false
			},

			total: {
				type: Sequelize.DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0
			},

            isCheckedOut: {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 0
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

	Cart.associate = function (models) {
        Cart.belongsTo(models.User, { foreignKey: 'userid' });
        Cart.belongsTo(models.Membership, { foreignKey: 'membershipid' });
		Cart.hasMany(models.CartItem, { foreignKey: 'cartid' });
        //Cart.hasOne(models.Order, { foreignKey: { name: 'cartid', unique: true } });
	};

	return Cart;
};