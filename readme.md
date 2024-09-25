![E-commerce](/public/img/e-commerce.jpg) 
 
# Application: **E-commerce API with Admin Front-End**
## Purpose: **To enable users after registration to use all the benefits of of the E-commerce API and the Admin Front-End according to their assigned roles.**
### Author: **Farid Vahabzada**

---

&nbsp;

# Application Installation and Usage Instructions
Not any special installation procedures are required other than downloading the whole repository locally, carrying out the database routine below, installing all the necessary packages with the **npm install** command, then starting the app with the **npm start**. And right after that, you have to populate the database by accessing the **/init** endpoint, then you are good to go!

You can access all the available endpoints at [the Swagger documentation endpoint](http://localhost:3000/doc/).

**P.S.** We used and recommend using Google Chrome for avoiding any functionality disruptions.

# Environment Variables
Information on the environment variables needed:
```
ADMIN_USERNAME = "Admin"
ADMIN_PASSWORD = "P@ssw0rd"
DATABASE_NAME = "eCommerce"
DIALECT = "mysql"
PORT = "3000"
HOST = "localhost"
TOKEN_SECRET = "4551d240c13e322c73886976d5d28ed454cedf802d2ec59d345e03a921a580a88e6daf2bae75ce4aa6fa697b28b85c194d95a6fba84098dbb533d875056d9810"
```

# Additional Libraries/Packages
The technologies / external libraries used are given below:

![Packages](/public/img/packages.png)

Additionally, **not** shown in the list but the packages like **crypto**, **fs**, **path** and **body-parser** were utilized at various stages of the project.

And for the front-end implementation, we used a Content Delivery Network (CDN) to access the files hosted on the internet. The links are placed and can be found in the header and script partial files. These include:
* Bootstrap frontend toolkit
* Bootstrap Icons icon library
* jQuery JS library

It is worth mentioning that the Bootstrap **JavaScript modal** plugin was made use of for the front-end part as well.

# NodeJS Version
Node version was accessed by the **node -v** command and it is shown below:

![Node Version](/public/img/node.png)

# MySql Database
The SQL script responsible for creating the database:
```sql
DROP DATABASE eCommerce;
CREATE DATABASE eCommerce;
USE eCommerce;
```
The SQL script responsible for creating the new user login and password with the admin rights and permissions:
```sql
CREATE USER 'Admin'@'localhost'
IDENTIFIED WITH mysql_native_password
BY 'P@ssw0rd';

GRANT ALL PRIVILEGES
ON eCommerce.*
TO 'Admin'@'localhost';
```

# Further Recommendations and Future Plans

The challenges faced, remarks for the users or the issues to be fixed for the future app versions can be found in the **_Reflection Report.pdf_** placed inside the **Documentation** folder in the main repository.

# References

Other than any mentions below, I mainly referred to the lessons' materials of the course and the codes written by myself from the other assignments as an inspiration.

The help of the following web resources came handy during the exam project development:
* [MySQL Documentation](https://dev.mysql.com/doc/)
* [JSON Schema Generator](https://www.jsonschema.net/)
* [Sequelize Documentation](https://sequelize.org/docs/v6/)
* [Jest Documentation](https://jestjs.io/docs/getting-started)
* [Pexels](https://www.pexels.com/)
* [Favicon Generator](https://realfavicongenerator.net/)
* [Swagger Documentation](https://swagger.io/docs/specification/2-0/basic-structure/)
* [Swagger Autogen Documentation](https://swagger-autogen.github.io/docs/openapi-3/#google_vignette)
* [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)

---