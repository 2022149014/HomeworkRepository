const express = require('express');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const router = express.Router();

async function getDBConnection() {
    const product_db = await sqlite.open({
        filename: 'product.db',
        driver: sqlite3.Database,
    });
    return product_db;
}

router.get('/', async (req, res) => {
    let product_db = await getDBConnection();
    let products = await product_db.all('SELECT * FROM products');
    await product_db.close();
    res.render('index', { products: products });
});

router.get("/filter", async (req, res) => {
    let query_str;
    if(req.query?.categories === "all" && req.query?.searchterm.trim() === "") query_str = "select * from products";
    else if(req.query?.categories === "all" && req.query?.searchterm.trim() != "") query_str = `select * from products where product_title like "%${req.query?.searchterm.trim()}%"`;
    else if(req.query?.categories != "all" && req.query?.searchterm.trim() === "") query_str = `select * from products where product_category = "${req.query?.categories}"`;
    else query_str = `select * from products where product_category = "${req.query?.categories}" and product_title like "%${req.query?.searchterm.trim()}%"`;

    if(req.query?.sort === "up") query_str += " order by product_price";

    let product_db = await getDBConnection();
    let products = await product_db.all(query_str);
    await product_db.close();

    res.render('index', { products: products });
});

router.get('/login', (req, res) => {
    res.render('login'); 
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

module.exports = router;