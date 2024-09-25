const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const bodyParser = require('body-parser');

require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var utilityRouter = require('./routes/utility');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var brandsRouter = require('./routes/brands');
var rolesRouter = require('./routes/roles');
var membershipsRouter = require('./routes/memberships');
var productsRouter = require('./routes/products');
var cartRouter = require('./routes/cart');
var ordersRouter = require('./routes/orders');
var orderStatusesRouter = require('./routes/orderStatuses');
var adminRouter = require('./routes/admin');

var db = require('./models');
db.sequelize.sync({ force: false });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', utilityRouter);
app.use('/', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/brands', brandsRouter);
app.use('/roles', rolesRouter);
app.use('/memberships', membershipsRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/orderstatuses', orderStatusesRouter);

app.use(bodyParser.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
