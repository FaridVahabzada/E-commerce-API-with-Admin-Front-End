module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define(
		'User',
		{
            userid: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
				unique: true
            },

			username: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: true
			},

			email: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: true
			},

			password: {
				type: Sequelize.DataTypes.BLOB,
				allowNull: false
			},

			salt: {
				type: Sequelize.DataTypes.BLOB,
				allowNull: false
			},

            firstname: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			},

			lastname: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			},

            address: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			},

            telephonenumber: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			},

            roleid: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                defaultValue: 2
            },

			membershipid: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                defaultValue: 1
			}

		},
		{
			timestamps: false,
		}
	);

	User.associate = function (models) {
        User.belongsTo(models.Role, { foreignKey: 'roleid' });
		User.belongsTo(models.Membership, { foreignKey: 'membershipid' });
		User.hasMany(models.Cart, { foreignKey: 'userid' });
		User.hasMany(models.Order, { foreignKey: 'userid' });
	};

	return User;
};