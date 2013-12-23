var Plugme = require('plugme');

var plug = new Plugme();

plug.set('serverPort', 3000);

plug.set('loginAction', ['users'], function (users, next) {
    var loginAction = function (req, res) {
        users.isValid(req.query.username, req.query.password, function (err, result) {
            if (result) {
                res.send('connected');
            } else {
                res.send('not connected');
            }
        })
    }
    next(loginAction);
})

plug.set('users', function (next) {
    var users = {
        isValid: function (username, password, cb) {
            if (username == 'admin' && password == 'admin') {
                cb(null, true);
            } else {
                cb(null, false);
            }
        }
    }
    next(users);
})

plug.set('app', ['loginAction'], function (loginAction, next) {
    var express = require('express');
    var app = express();
    app.get('/', loginAction);
    app.listen(3000, function (err) {
        next(app);
    })
})

plug.get(['app', 'serverPort'], function (app, serverPort) {
    console.log('Server listening on port:' + serverPort);
})
