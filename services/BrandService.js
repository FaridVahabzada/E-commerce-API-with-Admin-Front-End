class BrandService {
    constructor(db) {
        this.client = db.sequelize;
        this.Brand = db.Brand;
    };

    async getOneByName(brand) {
        return this.Brand.findOne({
            where: {
                brand: brand
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneById(brandid) {
        return this.Brand.findOne({
            where: {
                brandid: brandid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    
    async getAll() {
        return this.Brand.findAll({
            where: {}
        }).catch(function (err) {
            console.log(err);
        });
    };

    async create(brand) {
        return this.Brand.create(
            {
                brand: brand
            }
        ).catch(function (err) {
            console.log(err);
        });
    };
    
    async update(brandid, brand) {
        return this.Brand.update(
        {
            brand: brand
        },
        {
            where: {
                brandid: brandid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async delete(brandid) {
        return this.Brand.destroy({
            where: {
                brandid: brandid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

};

module.exports = BrandService;