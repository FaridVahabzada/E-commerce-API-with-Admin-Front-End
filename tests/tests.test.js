const express = require('express');
const request = require('supertest');

const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');

var usersRouter = require('../routes/users');
var brandsRouter = require('../routes/brands');
var categoriesRouter = require('../routes/categories');
var productsRouter = require('../routes/products');


app.use(bodyParser.json());
app.use('/', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/brands', brandsRouter);
app.use('/products', productsRouter);

var db = require('../models');
var BrandService = require('../services/BrandService');
var brandService = new BrandService(db);
var CategoryService = require('../services/CategoryService');
var categoryService = new CategoryService(db);
var ProductService = require('../services/ProductService');
var productService = new ProductService(db);



describe('testing-scenarios', () => {
    let token;
    test("POST /auth/login - success", async () => {
        const credentials = {
            username: "Admin",
            password: "P@ssword2023"
        };
        const { body } = await request(app).post("/auth/login").send(credentials);
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("you are now logged in.");
        expect(body.data.userid).toBe(1);
        expect(body.data).toHaveProperty("token");
        token = body.data.token;
    });

    test("POST /auth/login - fail", async () => {
        const credentials = {
            username: "XXXXX",
            password: "XXXXX"
        };
        const { body } = await request(app).post("/auth/login").send(credentials);
        expect(body).toEqual({
            "status": "fail",
            "statuscode": 400,
            "data": {
                "result": "there exists no such user with provided credentials!"
            }
        });
    });

    let categoryId;
    let brandId;
    test("POST /categories - success", async () => {
        const newBrand = {
            "brand": "TEST_BRAND"
        };
        await request(app).post("/brands").set('Authorization', 'Bearer ' + token).send(newBrand);
        brandId = await brandService.getOneByName("TEST_BRAND").then((data) => {return data.brandid;});
        
        const newCategory = {
            "category": "TEST_CATEGORY"
        };
        const { body } = await request(app).post("/categories").set('Authorization', 'Bearer ' + token).send(newCategory);
        categoryId = await categoryService.getOneByName("TEST_CATEGORY").then((data) => {return data.categoryid;});
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("a new category's created!");
        expect(body.data.category.category).toBe("TEST_CATEGORY");
    });

    let productId;
    test("POST /products - success", async () => {
        const newProduct = {
            "product": "TEST_PRODUCT",
            "description": "XXX",
            "unitprice": 0,
            "imgurl": "XXX",
            "quantity": 0,
            "brandid": brandId,
            "categoryid": categoryId
        };
        const { body } = await request(app).post("/products").set('Authorization', 'Bearer ' + token).send(newProduct);
        productId = await productService.getOneByProduct("TEST_PRODUCT").then((data) => {return data.productid;});
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("a new product's created!");
        expect(body.data.product.product).toBe("TEST_PRODUCT");
        expect(body.data.product.categoryid).toBe(categoryId);
        expect(body.data.product.brandid).toBe(brandId);
    });

    test("PUT /products - success", async () => {
        const productToUpdate = {
            "productid": productId,
            "product": "TEST_PRODUCT_UPDATED",
            "description": "XXX",
            "unitprice": 0,
            "imgurl": "XXX",
            "quantity": 0,
            "isdeleted": 0,
            "brandid": brandId,
            "categoryid": categoryId
        };
        const { body } = await request(app).put("/products").set('Authorization', 'Bearer ' + token).send(productToUpdate);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("product's updated!");
        expect(body.data.product.productid).toBe(productId);
        expect(body.data.product.categoryid).toBe(categoryId);
        expect(body.data.product.brandid).toBe(brandId);
    });

    test("GET /products - success", async () => {
        const { body } = await request(app).get("/products");
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("products found.");
    });

    test("PUT /categories - success", async () => {
        const categoryToUpdate = {
            "categoryid": categoryId,
            "category": "TEST_CATEGORY_UPDATED"
        };
        const { body } = await request(app).put("/categories").set('Authorization', 'Bearer ' + token).send(categoryToUpdate);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("category's updated!");
        expect(body.data.category.categoryid).toBe(categoryId);
        expect(body.data.category.category).toBe("TEST_CATEGORY_UPDATED");
    });

    test("GET /categories - success", async () => {
        const { body } = await request(app).get("/categories");
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("categories found.");
    });

    test("DELETE /products - success", async () => {
        const productToDelete = {
            "productid": productId
        };
        const { body } = await request(app).delete("/products").set('Authorization', 'Bearer ' + token).send(productToDelete);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("product's deleted!");
        expect(body.data.product.productid).toBe(productId);
        expect(body.data.product.categoryid).toBe(categoryId);
        expect(body.data.product.brandid).toBe(brandId);
    });

    test("DELETE /categories - fail", async () => {
        const categoryToDelete = {
            "categoryid": categoryId
        };
        const { body } = await request(app).delete("/categories").set('Authorization', 'Bearer ' + token).send(categoryToDelete);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("cannot remove the category! there exists one or more products related to this category!");

        await productService.delete(productId);
        await brandService.delete(brandId);
        await categoryService.delete(categoryId);
    });
});