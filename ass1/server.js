var express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan');

var dishRouter = require('./dishRouter'),
	promoRouter = require('./promoRouter'),
	leaderRouter = require('./leaderRouter');

var hostname = 'localhost'
	port = 3000;


var app = express();

app.use(morgan('dev'));

dr = dishRouter.getRouter();
pr = promoRouter.getRouter();
lr = leaderRouter.getRouter();

app.use('/dishes',dr);
app.use('/promotions', pr);
app.use('/leadership', lr);


app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});