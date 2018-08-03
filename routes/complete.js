// Global-Library
let express = require('express');
let router = express.Router();

// Router-Library
let request = require("request"); // Request


router.get('/complete/:document', function (req, res) {
	request("https://alphawiki.org/complete/" + encodeURIComponent(req.params.document), function (error, response, body) {
		res.send(body);
		return true;
	});
});
module.exports = router