import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import session from 'cookie-session';
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

app.use(session({
  secret: 'ABCDEFG',
  cookie: {
    maxAge: 604800000
  },
  overwrite: false
}));

app.use((req, res, next) => {
  if (!req.session.visitCount) {
    req.session.visitCount = 1;
  } else {
    req.session.visitCount++;
  }

  next();
});

app.set('port', process.env.PORT || 3030);

app.get('/', (req, res, next) => {
  return res.render('index', {
    hexagrams: hexagrams,
    visits: req.session && req.session.visitCount,
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