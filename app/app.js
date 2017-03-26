var express = require('express');
var app = express();
var fsp = require('fs-promise');
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
var config = require(process.env.NODE_ENV === 'production' ? './config.js' : './config.dev.js');


// connect to mongodb
mongoose.connect('mongodb://localhost/webeditor', function(err) {
  if (err) {
    console.error('Unable to connect to mongoDB: ', err);
  }
});

fsp.ensureDir(config.repoPath);


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
        console.log(err);
        return next(err);
    }
});



if (process.env.NODE_ENV !== 'production')  {
    var WebpackDevServer = require('webpack-dev-server');
    var webpack = require("webpack");
    var webpackConfig = require("./webpack.dev.config.js");
    var compiler = webpack(webpackConfig);
    var server = new WebpackDevServer(compiler, {
        port: 8081,
        hot: true,
        contentBase: __dirname + '/frontend/public',
        quiet: false,
        noInfo: false,
        publicPath: "/js/",
        historyApiFallback: true,
        stats: { colors: true }
    });
    var proxy = require('http-proxy-middleware');
    var url = require('url');
    app.use('/*', proxy({ target: 'http://localhost:8081' }));
    server.listen(8081, "localhost", function() {
        console.log('WebpackDevServer started');
    });
} else {
    var frontendRouter = require('./frontend');
    app.use(frontendRouter);
}


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