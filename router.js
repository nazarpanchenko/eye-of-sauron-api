const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8080;
const authRouter = require('./routes/auth.js');
const routes = require('./routesList.js');

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.set('port', PORT);

app.listen(PORT, function(err) {
    if (err) {
		console.log(err);
	}
    console.log('Server listening on port ', PORT);
});

app.get('/', function(req, res) {
	if (req.session.pageViews) {
	   req.session.pageViews++;
	   res.send('You visited this page ' + req.session.pageViews + ' times');
	} else {
	   req.session.pageViews = 1;
	   res.send('You visited this page ' + req.session.pageViews + ' times');
	}
});

// Registering API routes
routes.map(route => (
	app.get(route.path, function(req, res) {
		res.send(`${route.name} route is currently active`);
	})
));

app.use(`${process.env.API_BASE_URL}/auth`, authRouter);
