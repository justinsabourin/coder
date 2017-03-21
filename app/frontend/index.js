var express = require('express');
var router = express.Router();
var path = require('path');
var compression = require('compression');


router.use(compression());


router.use(express.static(path.join(__dirname, 'public')));

router.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

module.exports = router;
