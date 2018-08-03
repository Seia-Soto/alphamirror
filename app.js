/** Alphamirrror : Alphawiki's mirror
*
*  Copyright (C) 2018  UnknownLJH <unknownljh@protonmail.ch>
*
*  This program is free software: you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation, either version 3 of the License, or
*  (at your option) any later version.
*
*  This program is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  You should have received a copy of the GNU General Public License
*  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
**/

// --- Define ---

// Express
let express = require('express');
let app = express();
app.set('views', './views');
app.set('view engine', 'pug');

// Router
let index = require('./routes/index');
let read = require('./routes/read');
let read2 = require('./routes/read2');
let read3 = require('./routes/read3');
let read4 = require('./routes/read4');
let read5 = require('./routes/read5');
let go = require('./routes/go');
let wred = require('./routes/wred');
let complete = require('./routes/complete');

// Doc Write & Check & Read
let fs = require('fs');
let doc =
{
   exists: (name) => fs.existsSync(`${__dirname}/docs/${encodeURIComponent(name)}.namu`),
   remove: (name) => doc.exists(name) ? fs.unlinkSync(`${__dirname}/docs/${encodeURIComponent(name)}.namu`) : '',
   write: (name, wikitext) => fs.writeFileSync(`${__dirname}/docs/${encodeURIComponent(name)}.namu`, wikitext, {
       encoding: 'utf8'
   }),
   read: (name) => doc.exists(name) ? fs.readFileSync(`${__dirname}/docs/${encodeURIComponent(name)}.namu`, {
       encoding: 'utf8'
   }) : ''
};

// Export Doc to Router
app.set('doc', doc);


// --- Source ---


app.get('/', index); // 인덱스

app.use(express.static('public'));

app.get('/:document', read); // 문서
app.get('/:doc1/:doc2', read2); // 문서
app.get('/:doc1/:doc2/:doc3', read3); // 문서
app.get('/:doc1/:doc2/:doc3/:doc4', read4); // 문서
app.get('/:doc1/:doc2/:doc3/:doc4/:doc5', read5); // 문서

app.get('/go/:document', go); // 검색 후 이동

app.get('/w/:document', wred); // /w/문서명 이동

app.get('/complete/:document', complete); // 검색 처리



app.listen(80, function() {
  console.log("Server is running on 80 port...");
});