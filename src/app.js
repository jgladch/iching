import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import hexagrams from '../bin/hexagrams.json';

const app = express();

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    json: function (obj) {
      return JSON.stringify(obj, null, " ");
    }
  }
}));

app.set('views', path.join(__dirname, '../', 'views'));

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '../', 'public')));

app.set('port', process.env.PORT || 3030);

app.get('/', (req, res, next) => {
  return res.render('index', {
    hexagrams: hexagrams,
    breathing: false
  });
});

app.get('/breathing', (req, res, next) => {
  return res.render('breathing', {
    breathing: true
  });
});

const server = app.listen(app.get('port'), () => {
  return console.log(`Server listening on port ${server.address().port}`);
});

module.exports = app;