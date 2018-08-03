// Global-Library
let express = require('express');
let router = express.Router();

// Router-Library
let request = require("request"); // Request
let cheerio = require('cheerio'); // HTML Parser
require('date-utils');
let newdate = new Date();


router.get('/:doc1/:doc2', function (req, res) {
	let doc = req.app.get('doc')
	name = req.params.doc1 + "/" + req.params.doc2;
	link = "https://alphawiki.org/w/" + encodeURIComponent(name);
	if(name == 'random') link = "https://alphawiki.org/random";
	request(link, function (error, response, body) {
		if(response.statusCode == 200 || response.statusCode == 302)
		{
			var $ = cheerio.load(body)
			$("a").each(function() {
				if($(this).hasClass('wiki-link-internal'))
				{
					var old_src=$(this).attr("href");
					var new_src = old_src.replace('/w', '');
					$(this).attr("href", new_src);   
				}
				
				
				if($(this).hasClass('nav-link') || $(this).hasClass('dropdown-item'))
				{
					var old_src=$(this).attr("href");
					var new_src = "https://alphawiki.org" + old_src;
					$(this).attr("href", new_src);
				}
			
			});
			$("aside.sidebar").remove(); // 사이드바 삭제
			$("div.btn-group").remove(); // 역링크 - 역사 등등 삭제
			$("div.user-dropdown").remove(); // 사용자 드롭다운 삭제
			$("a.user-menu").remove(); // 사용자 아이콘 삭제
			$("button#searchBtn").remove(); // 사용자 아이콘 삭제
			
			$("p.wiki-edit-date").text("최근 미러 적용 시각: " + newdate.toFormat('YYYY-MM-DD HH24:MI:SS')); // 최근 미러 적용 시각 표시
			doc.write(name, $.html());
		}
		else if(response.statusCode == 404)
		{
			doc.remove(name);
			res.render('notfound', {name: name});
			return true;
		}
		res.render('read', {data: doc.read(name), name: name});
		return true;
	})
});
module.exports = router