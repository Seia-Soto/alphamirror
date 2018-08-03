// Global-Library
let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
	//res.render('index');
	res.redirect('/' + encodeURIComponent('알파위키:대문'));
	return true;
});
module.exports = router;