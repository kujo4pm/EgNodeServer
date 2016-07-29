var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var favoriteSchema = Schema({
	dishes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dish'
	}],
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		unique: true
	}
},
{
	timestamps: true
});
var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;
