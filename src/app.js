import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import session from 'cookie-session';
import hexagrams from '../bin/hexagrams.json';

const app = express();

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    json: (obj) => {
      return JSON.stringify(obj, null, " ");
    },
    eachReverse: (context, options) => {
      let ret = '';

      if (context && context.length > 0) {
        for (let i = context.length - 1; i >= 0; i--) {
          ret += options.fn(context[i]);
        }
      } else {
        ret = options.inverse(this);
      }

      return ret;
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
  return res.render('list', {
    hexagrams: hexagrams,
    visits: req.session && req.session.visitCount,
    breathing: false
  });
});

app.get('/single', (req, res, next) => {
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