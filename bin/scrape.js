let osmosis = require('osmosis');
let counter = 1;

osmosis.get('http://oaks.nvg.org/changes-legge.html#1')
  .find('h2')
  .set(`title ${counter}`)
  .then((context, data, next) => {
    console.log('data: ', context, data);
    next(context, data);
  })
  .then((context, data, next) => {
    console.log('second callback: ', context, data);
    next(context, data);
  })
  .find('p')
  .set('decision')
  .then((context, data, next) => {
    console.log('data now: ', data);
    // next(context, data);
  })
  .data((result) => {
    console.log('result: ', result);
    process.exit(0);
  })
  .log(console.log)
  .error(console.log)
  .debug(console.log);