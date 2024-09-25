module.exports = (sequelize, Sequelize) => {
	const Product = sequelize.define(
		'Product',
		{
            productid: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
				unique: true
            },

			product: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				unique: true
			},

			description: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			},

            unitprice: {
				type: Sequelize.DataTypes.FLOAT,
				allowNull: false
			},

			imgurl: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			},

            quantity: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false
			},

            isdeleted: {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },

			brandid: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false
            },

			categoryid: {
                type: Sequelize.DataTypes.INTEGER,
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

	Product.associate = function (models) {
        Product.belongsTo(models.Brand, { foreignKey: 'brandid' });
        Product.belongsTo(models.Category, { foreignKey: 'categoryid' });
		Product.hasMany(models.CartItem, { foreignKey: 'productid' });
		Product.hasMany(models.OrderItem, { foreignKey: 'productid' });
	};

	return Product;
};