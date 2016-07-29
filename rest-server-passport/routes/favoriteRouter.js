	var express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	mongoose = require('mongoose');

	var Favorites = require('../models/favorites');
	var Verify = require('./verify');

	var favoriteRouter = express.Router();

	favoriteRouter.use(bodyParser.json());

	favoriteRouter.route('/')
	.get(Verify.verifyOrdinaryUser, function(req,res,next){
		Favorites.find({postedBy : req.decoded._doc._id})
		.populate('postedBy')
		.populate('dishes')
		.exec(function(err, favorites){
			console.log(req.decoded._doc);
			if(err) throw err;
			res.json(favorites);
		});
	})
	.post(Verify.verifyOrdinaryUser, function(req,res,next){
		Favorites.find({postedBy : req.decoded._doc._id}, function(err, favorite) {
			if(err) throw err;
			console.log("favorite:", favorite);
			if(favorite.length == 0)
			{
				Favorites.create({postedBy : req.decoded._doc._id, dishes:[req.body._id]},  function(err, newFavorite){
					console.log('Creating new fave for user ', req.decoded._doc._id);
					var id = favorite._id;
					res.json(newFavorite);
				});
			}
			else
			{
				console.log('Adding new fave for user ',req.decoded._doc._id);
				favorite[0].dishes.push(req.body._id);
				favorite[0].save(function(err, fave){
					if(err)	throw err;
					console.log('Fave added!');
					res.json(favorite[0]);
				});
			}

			
		})
	})
	.delete(Verify.verifyOrdinaryUser, function(req, res, next){
		//console.log("Deleting:" , req.params.promoId);
		Favorites.find({postedBy : req.decoded._doc._id}, function(err, favorite) {
			if(err) throw err;
			if(favorite.length == 0)
			{
				res.json({message : 'this user had no favourites'});
			}
			else
			{
				favorite[0].remove(function(err){
					if(err)	throw err;
					console.log('Faves deleted!');
					res.json({message: 'faves deleted'});
				});
			}
		});
	});


	favoriteRouter.route('/:faveId')
	.delete(Verify.verifyOrdinaryUser, function(req, res, next){
		//console.log("Deleting:" , req.params.promoId);
		Favorites.find({postedBy : req.decoded._doc._id}, function(err, favorite) {
			if(err) throw err;
			var index = favorite[0].dishes.indexOf(req.params.faveId);
			if(favorite.length == 0 || index == -1)
			{
				res.json({message : 'this user had no favourites or fave not found'});
			}
			else
			{
				favorite[0].dishes.splice(index);
				favorite[0].save(function(err){
					if(err)	throw err;
					console.log('Fave deleted!');
					res.json({message: 'fave deleted'});
				});
			}
		});
	});

	module.exports = favoriteRouter;