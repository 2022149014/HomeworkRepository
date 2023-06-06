const express = require('express');
const nunjucks = require('nunjucks');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const path = require('path');

const indexRouter = require('./routes/');
const productRouter = require('./routes/product');

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/', express.static(path.join(__dirname, 'public')));
nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use('/', indexRouter);
app.use('/product', productRouter);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log("서버가 실행됐습니다.");
    console.log(`서버주소: http://localhost:${app.get('port')}`);
})