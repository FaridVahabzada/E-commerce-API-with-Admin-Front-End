class CategoryService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
    };

    async getOneByName(category) {
        return this.Category.findOne({
            where: {
                category: category
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneById(categoryid) {
        return this.Category.findOne({
            where: {
                categoryid: categoryid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAll() {
        return this.Category.findAll({
            where: {}
        }).catch(function (err) {
            console.log(err);
        });
    };

    async create(category) {
        return this.Category.create(
            {
                category: category
            }
        );
    };
    
    async update(categoryid, category) {
        return this.Category.update(
        {
            category: category
        },
        {
            where: {
                categoryid: categoryid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async delete(categoryid) {
        return this.Category.destroy({
            where: {
                categoryid: categoryid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

};

module.exports = CategoryService;