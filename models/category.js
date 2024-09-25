module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('Category', {
        categoryid: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: {args: true, msg: "there already exists such categoryid!"},
            validate: {
                notNull: {msg: "categoryid is required! it cannot be null / undefined!"},
                isInt: {msg: "categoryid must be an integer and greater than 0!"},
                min: {args: 1, msg: "categoryid must be an integer and greater than 0!"}
            }
        },

        category: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: {args: true, msg: "there already exists such category!"},
            validate: {
                notNull: {msg: "category is required! it cannot be null / undefined!"},
                len: {
                    args: [1, 255],
                    msg: "length of the category field must be minimum 1 or maximum 255 characters!"
                }
            }
        }
        
    }, {
        timestamps: false
    });
    Category.associate = function(models) {
        Category.hasMany(models.Product, { foreignKey: 'categoryid'});
    };
    
    return Category;
};