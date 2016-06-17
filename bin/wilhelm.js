let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');
let _ = require('lodash');
let hex = require('../public/js/hexagrams.js');

let mergeHexArrays = (hexagrams) => {
  return hex.map((item, index) => {
    delete item.commentary;
    delete item.lines;

    let partner = hexagrams[index];

    _.each(partner, (val, key) => {
      if (key === 'name') {
        item['wilhelm_name'] = val;
      } else {
        item[key] = val;
      }
    });

    return item;
  });
};

const createRoutine = (cb) => {
  let result = [];

  return function routine(index) {
    if (index === 65) {
      cb(result);
      return;
    }

    request({
      uri: `http://www.ichingfortune.com/hexagrams/${index}.php`,
    }, (error, response, body) => {
      let $ = cheerio.load(body, {
        normalizeWhitespace: true
      });

      let hex = {
        order: index
      };

      let name = $('article h1').text();
      hex.name = name.slice(name.indexOf('-') + 2);

      $('article h2').each((index, element) => {
        let el = $(element);
        let name = el.text().toLowerCase();

        if (name === 'judgement' || name === 'the image') {
          let title = el.next().text();
          let next = el.next().next().nextUntil('h2').text();

          hex[name] = {
            text: title,
            commentary: next
          };

        } else if (name === 'the lines') {
          hex.lines = el.nextAll('h3').map((index, element) => {
            let el = $(element);
            let name = el.text();
            let summary = el.next().text();
            let commentary = el.next().next().text();

            return{
              text: name,
              summary: summary,
              commentary: commentary
            };
          }).get();
        } else {
          let next = el.next().text()
          hex[name] = next;
        }
      });

      result.push(hex);
      routine(index + 1);
    });
  };
};

let myRoutine = createRoutine((result) => {
  result.forEach((item, index) => {
    console.log(`${item.order}. ${item.name}`);
    console.log(`lines: ${item.lines.length}`);
  });

  fs.writeFile('./bin/hexagrams.json', JSON.stringify(mergeHexArrays(result)), 'utf8', () => {
    console.log('all done!');
  });
});

myRoutine(1);


