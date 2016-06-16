let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');
let hex = require('../public/js/hexagrams.js');

request({
  uri: 'http://oaks.nvg.org/changes-legge.html#1',
}, (error, response, body) => {
  let $ = cheerio.load(body, {
    normalizeWhitespace: true
  });

  let result = $('h1').map((index, element) => {
    let el = $(element);
    let name = el.text();
    let decision = el.next().next().next().text();
    let lines = el.next().next().next().nextUntil('p.n3').map((index, element) => {
      let el = $(element);
      let text = el.text().trim();
      
      return {
        text: text.slice(text.indexOf(' ') + 1)
      };
    }).get();
    
    return {
      name: name,
      decision: decision,
      lines: lines
    };
  }).get();

  result.shift(); // Remove introduction

  var endResult = hex.map((item, index, array) => {
    item.legge_name = result[index].name;
    item.commentary.decision = result[index].decision;
    item.lines = result[index].lines;
    return item;
  });

  fs.writeFile('./bin/hexagrams.json', JSON.stringify(endResult), 'utf8', () => {
    console.log('all done!');
  });
});