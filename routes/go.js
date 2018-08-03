// Global-Library
let express = require('express');
let router = express.Router();


router.get('/go/:document', function (req, res) {
	res.redirect('/'+req.params.document);
	return true;
});
module.exports = router