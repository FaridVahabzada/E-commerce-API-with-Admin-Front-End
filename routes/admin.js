var express = require('express');
var router = express.Router();
const axios = require('axios');

var jwt = require('jsonwebtoken');

const { checkTokenValid, checkTokenPresent } = require('../middleware/middleware');

// GET for admins to render the login / logout page for admin front-end
router.get('/', checkTokenValid, async (req, res, next) => {

	// #swagger.tags = ['The Admin Front-End Endpoints']
	// #swagger.description = "<h3>Renders the login page. If the token owner has an admin role, then the logout page, aka <b>the Home page</b>.</h3>"
    // #swagger.produces = ['text/html']
    // #swagger.responses = [200]
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const token = req.cookies.token;
    let username;
    let decodedToken;
    
    if (token != null) {
        try {
            decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (err) {
            res.clearCookie("token");
        };
    };

    if (decodedToken != null) {
        username = decodedToken.username ? decodedToken.username : undefined;
    };
    
    res.render('login', { currentUser: username });
});

// GET for admins to log out for admin front-end
router.get('/logout', checkTokenValid, async (req, res, next) => {

	// #swagger.tags = ['The Admin Front-End Endpoints']
	// #swagger.description = "<h3>Logs out a user if the token owner has an admin role. If not admin then returns the login page back to the user.</h3>"
    // #swagger.produces = ['text/html']
    // #swagger.responses = [200]
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    res.clearCookie("token");
    return res.redirect('/');
});

// GET for admins to render the products page for admin front-end
router.get('/admin/products', checkTokenPresent, checkTokenValid, async (req, res, next) => {

	// #swagger.tags = ['The Admin Front-End Endpoints']
	// #swagger.description = "<h3>Renders the products page if the token owner has an admin role. If any of the <b>product</b>, <b>categories</b> and <b>brands</b> request parameters are provided then renders the product page with a filtered product list. If not admin then returns the login page back to the user.</h3>"
    // #swagger.produces = ['text/html']
    // #swagger.responses = [200]
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    let username = decodedToken.username;
    let products;
    let productsSearched;
    let uniqueBrands;
    let uniqueCategories;

    await axios.get('http://localhost:3000/products')
    .then((response) => {
        products = response.data.data.product;
    })
    .catch((error) => {
        console.log(error.response.data);
    });

    await axios.get('http://localhost:3000/brands')
    .then((response) => {
        uniqueBrands = response.data.data.brand;
    })
    .catch((error) => {
        console.log(error.response.data);
    });

    await axios.get('http://localhost:3000/categories')
    .then((response) => {
        uniqueCategories = response.data.data.category;
    })
    .catch((error) => {
        console.log(error.response.data);
    });

    const {product, categories, brands} = req.query;

    if (product != null || categories != null || brands != null) {
        await axios.post('http://localhost:3000/search', {
            name: `${product}`,
            brand: `${brands}`,
            category: `${categories}`
        })
        .then((response) => {
            productsSearched = response.data.data.result.product;
        })
        .catch((error) => {
            console.log(error.response.data);
        });

        res.render('products', { currentUser: username, products: productsSearched, token: token, brands: uniqueBrands, categories: uniqueCategories });
    } else {
        res.render('products', { currentUser: username, products: products, token: token, brands: uniqueBrands, categories: uniqueCategories });
    };
});

// GET for admins to render the brands page for admin front-end
router.get('/admin/brands', checkTokenPresent, checkTokenValid, async (req, res, next) => {

	// #swagger.tags = ['The Admin Front-End Endpoints']
	// #swagger.description = "<h3>Renders the brands page if the token owner has an admin role. If not admin then returns the login page back to the user.</h3>"
    // #swagger.produces = ['text/html']
    // #swagger.responses = [200]
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    let username = decodedToken.username;
    let brands;

    await axios.get('http://localhost:3000/brands')
    .then((response) => {
        brands = response.data.data.brand;
    })
    .catch((error) => {
        console.log(error.response.data);
    });

    if (brands != null) {
        brands = brands.sort((x, y) => x.brandid - y.brandid);
    };

    res.render('brands', { currentUser: username, brands: brands, token: token });
});

// GET for admins to render the categories page for admin front-end
router.get('/admin/categories', checkTokenPresent, checkTokenValid, async (req, res, next) => {

	// #swagger.tags = ['The Admin Front-End Endpoints']
	// #swagger.description = "<h3>Renders the categories page if the token owner has an admin role. If not admin then returns the login page back to the user.</h3>"
    // #swagger.produces = ['text/html']
    // #swagger.responses = [200]
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    let username = decodedToken.username;
    let categories;

    await axios.get('http://localhost:3000/categories')
    .then((response) => {
        categories = response.data.data.category;
    })
    .catch((error) => {
        console.log(error.response.data);
    });

    if (categories != null) {
        categories = categories.sort((x, y) => x.categoryid - y.categoryid);
    };

    res.render('categories', { currentUser: username, categories: categories, token: token });
});

// GET for admins to render the users page for admin front-end
router.get('/admin/users', checkTokenPresent, checkTokenValid, async (req, res, next) => {

	// #swagger.tags = ['The Admin Front-End Endpoints']
	// #swagger.description = "<h3>Renders the users page if the token owner has an admin role. If not admin then returns the login page back to the user.</h3>"
    // #swagger.produces = ['text/html']
    // #swagger.responses = [200]
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const token = req.cookies.token;
    let decodedToken;
    
    if (token != null) {
        try {
            decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (err) {
            res.clearCookie("token");
            return res.redirect("/");
        };
    };

    let username = decodedToken.username ? decodedToken.username : undefined;
    let users;
    let roles;

    await axios.get('http://localhost:3000/users', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then((response) => {
        users = response.data.data.user;
    })
    .catch((error) => {
        console.log(error.response.data);
    });

    await axios.get('http://localhost:3000/roles')
    .then((response) => {
        roles = response.data.data.role;
    })
    .catch((error) => {
        console.log(error.response.data);
    });

    if (roles != null) {
        roles = roles.sort((x, y) => x.roleid - y.roleid);
    };

    res.render('users', { currentUser: username, users: users, roles: roles, token: token });
});

// GET for admins to render the orders page for admin front-end
router.get('/admin/orders', checkTokenPresent, checkTokenValid, async (req, res, next) => {

	// #swagger.tags = ['The Admin Front-End Endpoints']
	// #swagger.description = "<h3>Renders the orders page if the token owner has an admin role. If not admin then returns the login page back to the user.</h3>"
    // #swagger.produces = ['text/html']
    // #swagger.responses = [200]
    /*
	#swagger.security = [{
        "bearerAuth": []
    }]
	*/

    const token = req.cookies.token;
    let decodedToken;
    
    if (token != null) {
        try {
            decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (err) {
            res.clearCookie("token");
            return res.redirect("/");
        };
    };

    let username = decodedToken.username ? decodedToken.username : undefined;
    let orders;
    let statuses;

    await axios.get('http://localhost:3000/orders', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then((response) => {
        orders = response.data.data.order;
    })
    .catch((error) => {
        console.log(error.response.data);
    });

    await axios.get('http://localhost:3000/orderstatuses')
    .then((response) => {
        statuses = response.data.data.orderstatus;
    })
    .catch((error) => {
        console.log(error.response.data);
    });

    if (statuses != null) {
        statuses = statuses.sort((x, y) => x.orderstatusid - y.orderstatusid);
    };

    res.render('orders', { currentUser: username, orders: orders, statuses: statuses, token: token });
});

module.exports = router;