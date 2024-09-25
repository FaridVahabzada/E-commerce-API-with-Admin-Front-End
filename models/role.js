module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
        roleid: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },

        role: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        }
        
    }, {
        timestamps: false
    });
    Role.associate = function(models) {
        Role.hasMany(models.User, { foreignKey: 'roleid'});
    };
    
    return Role;
};