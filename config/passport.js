const passport = require('passport'),
	User = require('../models/user'),
	LocalStrategy = require('passport-local').Strategy,
	expressValidator = require('express-validator');

// allows passport to store the user.id in the session and retrieve the user from the DB.
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// uses the serialized id to go and grab all of the info about that user stored on the DB.
passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

// middleware to create new user
passport.use(
	'local.signup',
	new LocalStrategy(
		// changing default so that email acts similar to username
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		(req, email, password, done) => {
			// validate form input
			req.checkBody('email', 'Valid email required.').notEmpty().isEmail();
			req
				.checkBody('password', 'Valid password required.')
				.notEmpty()
				.isLength({ min: 6 });
			const errors = req.validationErrors();
			if (errors) {
				const messages = [];
				errors.map(error => messages.push(error.msg));
				return done(null, false, req.flash('error', messages));
			}
			// check if user exists in DB
			User.findOne({ email: email }, (err, user) => {
				if (err) {
					return done(err);
				}
				// email is in use
				if (user) {
					return done(null, false, { message: 'Email is already in use.' });
				}
				// email is not in use. create new user.
				let newUser = new User();
				newUser.email = email;
				newUser.password = newUser.encryptPassword(password);
				newUser.save((err, result) => {
					if (err) {
						return done(err);
					}
					return done(null, newUser);
				});
			});
		}
	)
);

passport.use(
	'local.login',
	new LocalStrategy(
		// changing default so that email acts similar to username
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		(req, email, password, done) => {
			// validate form input
			req.checkBody('email', 'Valid email required.').notEmpty().isEmail();
			req.checkBody('password', 'Valid password required.').notEmpty();
			const errors = req.validationErrors();
			if (errors) {
				const messages = [];
				errors.map(error => messages.push(error.msg));
				return done(null, false, req.flash('error', messages));
			}
			// check if user exists in DB
			User.findOne({ email: email }, (err, user) => {
				if (err) {
					return done(err);
				}
				// email is not in use
				if (!user) {
					return done(null, false, { message: 'No user found.' });
				}
				// email is in use. check if the password matches.
				if (!user.comparePassword(password)) {
					return done(null, false, { message: 'Invalid password.' });
				}
				// If the email and password exist in the database, log in:
				return done(null, user);
			});
		}
	)
);
