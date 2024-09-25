const { QueryTypes } = require('sequelize');
const db = require('../models');
class ProductService {
    constructor(db) {
        this.client = db.sequelize;
        this.Product = db.Product;
    };

    async getOneByProductId(productid) {
        return this.Product.findOne({
            where: {
                productid: productid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByProduct(product) {
        return this.Product.findOne({
            where: {
                product: product
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByCategory(categoryid) {
        return this.Product.findOne({
            where: {
                categoryid: categoryid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getOneByBrand(brandid) {
        return this.Product.findOne({
            where: {
                brandid: brandid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAll() {
        return this.Product.findAll({
            where: {}
        }).catch(function (err) {
            console.log(err);
        });
    };

    async getAllRawSql() {
        return await db.sequelize.query("SELECT productid, product, description, unitprice, imgurl, quantity, isdeleted, P.brandid, brand, P.categoryid, category, createdAt, updatedAt FROM Products AS P JOIN Brands AS B ON B.brandid = P.brandid JOIN Categories AS C ON C.categoryid = P.categoryid GROUP BY P.productid ORDER BY P.productid ASC;", {
            raw: true,
            type: QueryTypes.SELECT
        });
    };

    async getAllSearch(name, brand, category) {
        return await db.sequelize.query("SELECT productid, product, description, quantity, unitprice, brand, category, imgurl, isdeleted FROM Products AS P JOIN Brands AS B ON B.brandid = P.brandid JOIN Categories AS C ON C.categoryid = P.categoryid WHERE product LIKE '%" + (name ? name : "") + "%' AND category LIKE '%" + (category ? category : "") + "%' AND brand LIKE '%" + (brand ? brand : "") + "%' GROUP BY P.productid ORDER BY P.productid ASC;", {
            raw: true,
            type: QueryTypes.SELECT
        });
    };

    async create(product, description, unitprice, imgurl, quantity, brandid, categoryid) {
        return this.Product.create(
            {
                product: product,
                description: description,
                unitprice: unitprice,
                imgurl: imgurl,
                quantity: quantity,
                brandid: brandid,
                categoryid: categoryid
            }
        ).catch(function (err) {
            console.log(err);
        });
    };
    
    async update(productid, product, description, unitprice, imgurl, quantity, isdeleted, brandid, categoryid) {
        return this.Product.update(
        {
            product: product,
            description: description,
            unitprice: unitprice,
            imgurl: imgurl,
            quantity: quantity,
            isdeleted: isdeleted,
            brandid: brandid,
            categoryid: categoryid
        },
        {
            where: {
                productid: productid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    
    async updateQuantity(productid, quantity) {
        return this.Product.update(
        {
            quantity: quantity
        },
        {
            where: {
                productid: productid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    
    async softDelete(productid) {
        return this.Product.update(
        {
            isdeleted: 1
        },
        {
            where: {
                productid: productid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

    async delete(productid) {
        return this.Product.destroy({
            where: {
                productid: productid
            }
        }).catch(function (err) {
            console.log(err);
        });
    };

};

module.exports = ProductService;