const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const authRouter = require('./routes/auth.js');
const routes = require('./routesList.js');

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.set('port', PORT);

app.listen(PORT, function(err) {
    if (err) {
		console.log(err);
	}
    console.log('Server listening on port ', PORT);
});

// Registering API routes
routes.map(route => (
	app.get(route.path, function(req, res) {
		res.send(`${route.name} route is currently active`);
	})
));

app.use(`${process.env.API_BASE_URL}/auth`, authRouter);
