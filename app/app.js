var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var MemcachedStore = require('connect-memcached')(session);
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Routes
var authenticateRouter = require('./authenticate/router');
var contentRouter = require('./content/router');
var projectsRouter = require('./projects/router');

var middleware = require('./middleware');
var passport = require('./authenticate/passport');


// connect to mongodb
mongoose.connect('mongodb://localhost/webeditor', function(err) {
  if (err) {
    console.error('Unable to connect to mongoDB: ', err);
  }
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    store: new MemcachedStore({
        hosts: ['127.0.0.1:11211'],
    }),
    saveUninitialized: true,
    cookie: {httpOnly: true, sameSite: true} // HAProxy handles setting the secure property
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/auth', authenticateRouter);
app.use('/api/projects', middleware.authorizedRoute, middleware.privateRoute, projectsRouter);
app.use('/staticcontent', contentRouter);

app.use(function (err, req, res, next) {
    if (err.status) {
        if (err.type === 'json')
            res.status(err.status).json(err.message);
        else   
            res.status(err.status).end(err.message);
    } else {
        return next(err);
    }
});


var frontendRouter = require('./frontend');
if (process.env.NODE_ENV !== 'production')  {
    var webpackDevMiddleware = require("webpack-dev-middleware");
    var webpack = require("webpack");
    var webpackConfig = require("./webpack.dev.config.js");
    var compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: "/js/",
        index: __dirname + '/frontend/public/index.html',
        stats: {
            colors: true,
        },
        hot: true
    }));
    app.use(require("webpack-hot-middleware")(compiler, {
        log: console.log,
        path: '/__webpack_hmr',
    })); 
}

app.use(frontendRouter);



module.exports = app;

if (require.main === module) {
    // var fs = require('fs');
    // var https = require('https');
    // var privateKey = fs.readFileSync( 'server.key' );
    // var certificate = fs.readFileSync( 'server.crt' );
    // var config = {
    //         key: privateKey,
    //         cert: certificate
    // };
    // https.createServer(config, app).listen(8080, function(){
    //     console.log('App running HTTPS on port 8080');
    // });
    app.listen(8080, function () {
        console.log('App listening on port 8080');
    });
}