const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
	// User: stores the id as a reference to the User model
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	cart: { type: Object, required: true },
	// PaymentId: refers to the payment ID in Stripe.
	paymentId: { type: String, required: true },
	date: { type: String }
});

module.exports = mongoose.model('Order', schema);
