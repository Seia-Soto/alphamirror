
Keim - NamuMark Processor
=========================

An open source version of NamuMark processor in JavaScript.

Keim is a lightweight wiki markup processor. It aims to support common syntax of
NamuMark, the markup language used in [NamuWiki](https://namu.wiki/). However, not all markup tags are
supported. Also, the rendering output may not be the same, though in most cases,
this is intended behaviour. Please use [GitHub issues](https://github.com/yeonwoonj/keim/issues) for any suggestions.

## Limitations
image and video tags will be truncated. also, the iframe is treated as a video tag.

## Running a demo locally
1. git clone https://github.com/yeonwoonj/keim.git
2. cd keim
3. python -m SimpleHTTPServer 8000
4. open http://localhost:8000/test

NB: Use latest Firefox or Safari to run the test. Chrome and Node.js won't work.

## See Also
* https://namu.wiki/w/나무위키:엔진
* https://namu.wiki/w/나무위키:편집%20도움말

## License
GNU GPLv3, see COPYING for detail.

## Author
Yeonwoon JUNG <flow3r@gmail.com>

https://github.com/yeonwoonj/keim/contributors

