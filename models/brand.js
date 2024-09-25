module.exports = (sequelize, Sequelize) => {
    const Brand = sequelize.define('Brand', {
        brandid: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },

        brand: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        }

    }, {
        timestamps: false
    });
    Brand.associate = function(models) {
        Brand.hasMany(models.Product, { foreignKey: 'brandid' });
    };
    
    return Brand;
};