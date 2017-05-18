const express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	session = require('express-session'),
	passport = require('passport'),
	flash = require('connect-flash'),
	expressValidator = require('express-validator'),
	MongoStore = require('connect-mongo')(session),
	stripe = require('stripe')('sk_test_QO0JCu8luYte8Frc5cL5Oq2C');

const routes = require('./routes/index');
const userRoutes = require('./routes/user');

const app = express();

const mongoDB = 'localhost:27017/cart';
mongoose.connect(mongoDB);

require('./config/passport');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(
	session({
		secret: 'themostsecret',
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		// session storage length
		cookie: { maxAge: 180 * 60 * 1000 }
	})
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// a boolean global variable that tells us if we are logged in or not.
app.use((req, res, next) => {
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	next();
});

app.use('/user', userRoutes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
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
