const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),
	expressValidator = require('express-validator');

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

userSchema.methods.encryptPassword = password => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

// example of arrow function messing with the value of this. must use function(password)...
userSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
