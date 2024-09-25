module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define('Membership', {
        membershipid: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },

        membership: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        discount: {
            type: Sequelize.DataTypes.FLOAT,
            allowNull: false
        }
        
    }, {
        timestamps: false
    });
    Membership.associate = function(models) {
        Membership.hasMany(models.User, { foreignKey: 'membershipid'});
        Membership.hasMany(models.Cart, { foreignKey: 'membershipid'});
        Membership.hasMany(models.Order, { foreignKey: 'membershipid'});
    };
    
    return Membership;
};