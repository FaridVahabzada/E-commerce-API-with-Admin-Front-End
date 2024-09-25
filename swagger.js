const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        version: "1.0.0",
        title: "E-commerce API",
        description: "<h2>To be able to bypass the JWT authentication for the endpoints needing authorization, \
        login first, then use the token recieved, press the <b>Authorize</b> button and type 'Bearer ' and paste the token copied. \
        After, you can access the enpoints requiring authorization without filling the <b>Authorization</b> field.</h2>"
    },
    host: "localhost:3000",
    definitions: {
        userLogin: {
            $email: "Admin",
            $username: "Admin",
            $password: "P@ssword2023"
        },
        newUserRegister: {
            $username: "JohnDoe",
            $email: "JohnDoe@gmail.com",
            $password: "P4ssw0rd",
            $firstname: "John",
            $lastname: "Doe",
            $address: "Oslo, Norway",
            $telephonenumber: "99999999"
        },
        productSearch: {
            $name: "iPhone 6s Plus 16Gb",
            $brand: "Apple",
            $category: "Phones"
        },
        userChange: {
            $userid: 1,
            $firstname: "Jane",
            $lastname: "Doe",
            $address: "Oslo, Norway",
            $telephonenumber: "88888888",
            $roleid: 2
        },
        userDelete: {
            $userid: 1
        },
        roleCreate: {
            $role: "User"
        },
        roleChange: {
            $roleid: 2,
            $role: "Admin"
        },
        roleDelete: {
            $roleid: 2
        },
        categoryCreate: {
            $category: "Phones"
        },
        categoryChange: {
            $categoryid: 2,
            $category: "Phones"
        },
        categoryDelete: {
            $categoryid: 2
        },
        brandCreate: {
            $brand: "Apple"
        },
        brandChange: {
            $brandid: 2,
            $brand: "Apple"
        },
        brandDelete: {
            $brandid: 2
        },
        membershipCreate: {
            $membership: "Gold"
        },
        membershipChange: {
            $membershipid: 2,
            $membership: "Gold",
            $discount: 30
        },
        membershipDelete: {
            $membershipid: 2
        },
        productCreate: {
            $product: "XXX",
            $description: "XXX",
            $unitprice: 0,
            $imgurl: "XXX",
            $quantity: 0,
            $brandid: 1,
            $categoryid: 1
        },
        productChange: {
            $productid: 1,
            $product: "XXX",
            $description: "XXX",
            $unitprice: 0,
            $imgurl: "XXX",
            $quantity: 0,
            $isdeleted: 1,
            $brandid: 1,
            $categoryid: 1
        },
        productDelete: {
            $productid: 1
        },
        cartItemCreate: {
            $productid: 1,
            $quantity: 1
        },
        cartItemQuantiyChange: {
            $cartitemid: 1,
            $quantity: 1
        },
        cartItemDelete: {
            $cartitemid: 1
        },
        orderStatusUpdate: {
            $ordernumber: "qvj79w0b",
            $orderstatusid: 2
        },
        orderStatusCreate: {
            $orderstatus: "Ordered"
        },
        orderStatusChange: {
            $orderstatusid: 2,
            $orderstatus: "Completed"
        },
        orderStatusDelete: {
            $orderstatusid: 2
        }
    },
    securityDefinitions: {
        bearerAuth: {
            type: "apiKey",
            in: "header",
            name: "Authorization"
        }
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./bin/www');
});