const express = require('express'),
	router = express.Router(),
	csrf = require('csurf'),
	passport = require('passport'),
	csrfProtection = csrf();

const Order = require('../models/order'), Cart = require('../models/cart');
router.use(csrfProtection);

router.get('/signup', isLoggedOut, (req, res, next) => {
	res.render('user/signup', {
		title: 'Sign up',
		csrfToken: req.csrfToken(),
		messages: req.flash('error')
	});
});

router.post(
	'/signup',
	isLoggedOut,
	passport.authenticate('local.login', {
		// route handling:
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	})
);

router.get('/login', isLoggedOut, (req, res, next) => {
	res.render('user/login', {
		title: 'Log in',
		csrfToken: req.csrfToken(),
		messages: req.flash('error')
	});
});

// need to watch the video again and see how german guy does it.
router.post(
	'/login',
	isLoggedOut,
	passport.authenticate('local.login', {
		// route handling:
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	})
);

router.get('/profile', isLoggedIn, (req, res, next) => {
	Order.find({ user: req.user }, (err, orders) => {
		if (err) {
			red.redirect('/');
		}
		let cart;
		orders.forEach(order => {
			cart = new Cart(order.cart);
			order.items = cart.generateArray();
		});

		res.render('user/profile', {
			title: 'Purchase History',
			csrfToken: req.csrfToken(),
			messages: req.flash('error'),
			user: req.user,
			orders: orders
		});
	});
});

router.get('/logout', (req, res, next) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}
