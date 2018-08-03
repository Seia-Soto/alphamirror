// Global-Library
let express = require('express');
let router = express.Router();

// Router-Library
let request = require("request"); // Request
let cheerio = require('cheerio'); // HTML Parser
require('date-utils');
let newdate = new Date();


router.get('/:document', function (req, res) {
	let doc = req.app.get('doc')
	name = req.params.document;
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
			$("p").each(function() {
				if($(this).text() == "Alphawiki.org")
				{
					$(this).text('Alphamirror.tk | Mirror Of Alphawiki.org | We never collect your Privacy. | Support : UnknownLJH (@t) protonmail.ch | We can get Korean and English question')
					$(this).after('<p>From Somewhere of Korea, with My <3 | Copyright questions should go to Alphawiki.org<p></br><p>Thanks to namu, Cloudflare and Protonmail | Site is TOO Slow, Maybe you could use when Alphawiki is down')
					
				}
			});
			$("aside.sidebar").remove(); // 사이드바 삭제
			$("div.btn-group").remove(); // 역링크 - 역사 등등 삭제
			$("div.user-dropdown").remove(); // 사용자 드롭다운 삭제
			$("a.user-menu").remove(); // 사용자 아이콘 삭제
			$("button#searchBtn").remove(); // 사용자 아이콘 삭제
			name = $("span.wiki-document-title").text() // 문서 이름
		
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