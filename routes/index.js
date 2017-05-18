const express = require('express'),
	router = express.Router(),
	csrf = require('csurf'),
	passport = require('passport'),
	csrfProtection = csrf(),
	stripe = require('stripe')('sk_test_QO0JCu8luYte8Frc5cL5Oq2C');

const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

router.use(csrfProtection);
/* GET home page. */
router.get('/', (req, res, next) => {
	const successMsg = req.flash('success')[0];

	// Retrieve products array from mongoDB
	Product.find((err, docs) => {
		// deal with issue of 3 products displayed per row
		const productChunksFor3 = [];
		const chunkSizeFor3 = 3;
		// iterate through products array and place each into
		for (let i = 0; i < docs.length; i += chunkSizeFor3) {
			productChunksFor3.push(docs.slice(i, i + chunkSizeFor3));
		}
		// deal with issue of 2 products displayed per row
		const productChunksFor2 = [];
		const chunkSizeFor2 = 2;
		// iterate through products array and place each into
		for (let i = 0; i < docs.length; i += chunkSizeFor2) {
			productChunksFor2.push(docs.slice(i, i + chunkSizeFor2));
		}
		console.log(productChunksFor3);
		res.render('index', {
			title: 'Store',
			productsFor3: productChunksFor3,
			productsFor2: productChunksFor2,
			csrfToken: req.csrfToken(),
			successMsg: successMsg,
			noMessage: !successMsg
		});
	});
});

router.post(
	'/signup',
	passport.authenticate('local.signup', {
		successRedirect: '/user/profile',
		failureRedirect: '/user/signup',
		failureFlash: true
	})
);

router.post(
	'/login',
	passport.authenticate('local.login', {
		// route handling:
		successRedirect: '/user/profile',
		failureRedirect: '/user/login',
		failureFlash: true
	})
);

router.get('/add-to-cart/:id', (req, res, next) => {
	let productID = req.params.id;
	// Check if the session has an existing cart. If not, create a new cart using an empty object.
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productID, (err, product) => {
		if (err) {
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/#' + productID);
	});
});

router.get('/update-cart/:id', (req, res, next) => {
	console.log('url: ', req.url);
	const productID = req.params.id;
	console.log('req.id: ', req.params.id);
	const itemQty = itemQtyRetrieveAndFormat(req.url);
	console.log('itemQty: ', itemQty);
	const cart = new Cart(req.session.cart);
	Product.findById(productID, (err, product) => {
		if (err) {
			return res.redirect('/');
		}
		cart.update(product, product.id, itemQty);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/cart');
	});
});

router.get('/remove/:id', (req, res, next) => {
	console.log('url: ', req.url);
	const productID = req.params.id;
	console.log('req.id: ', req.params.id);
	const cart = new Cart(req.session.cart);
	Product.findById(productID, (err, product) => {
		if (err) {
			return res.redirect('/');
		}
		cart.remove(product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/cart');
	});
});

router.get('/cart', (req, res, next) => {
	if (!req.session.cart) {
		return res.render('shop/cart', {
			title: 'Cart',
			csrfToken: req.csrfToken(),
			products: null
		});
	}
	const cart = new Cart(req.session.cart);
	res.render('shop/cart', {
		title: 'Cart',
		csrfToken: req.csrfToken(),
		products: cart.generateArray(),
		totalPrice: cart.totalPrice
	});
});

router.post('/charge', (req, res, next) => {
	if (!req.session.cart) {
		return res.render('shop/cart', {
			title: 'Cart',
			csrfToken: req.csrfToken(),
			products: null
		});
	}
	const cart = new Cart(req.session.cart);
	const totalPrice = cart.totalPrice * 100;
	console.log(totalPrice);
	const token = req.body.stripeToken;
	console.log(token);
	const charge = stripe.charges.create(
		{
			amount: totalPrice,
			currency: 'usd',
			description: 'Example charge',
			source: token
		},
		function(err, charge) {
			if (err) {
				console.log(charge);
				return res.redirect('/cart');
			}
			// Create a new order and save it to the DB.
			let date = Date();
			var order = new Order({
				// Passport creates the user object on the req. It can be accessed throughout the whole application.
				user: req.user,
				cart: cart,
				// charge is from the 'charge' argument passed to the earlier callback.
				paymentId: charge.id,
				date: formatDate(date)
			});
			order.save(function(error, result) {
				req.flash('success', 'Purchase Success!');
				req.session.cart = null;
				req.session.cart = false;
				res.redirect('/');
			});
		}
	);
});

router.get('/thankYou', (req, res, next) => {
	console.log(req.session.cart);
	const cart = new Cart(req.session.cart);
	res.render('shop/thankYou', {
		title: 'Thank you for your business!!!',
		csrfToken: req.csrfToken(),
		messages: req.flash('error')
	});
});

module.exports = router;

const itemQtyRetrieveAndFormat = param => {
	const itemQtyIndex = param.indexOf('?itemQty=');
	const itemQtyStr = param.slice(itemQtyIndex);
	return itemQtyStr.replace(/^\D+/g, '');
};

const formatDate = date => {
	let wkday = date.split(' ').slice(0, 1);
	let monthDayYear = date.split(' ').slice(1, 4).join(' ');
	return wkday + ', ' + monthDayYear;
};
