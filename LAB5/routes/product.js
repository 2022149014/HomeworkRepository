const express = require('express');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const { writeFile, readFile } = require('fs');

const router = express.Router();

async function getDBConnection() {
    const product_db = await sqlite.open({
        filename: 'product.db',
        driver: sqlite3.Database,
    });
    return product_db;
}

router.get('/:id', async (req, res) => {
    let product_db = await getDBConnection();
    let product_id = parseInt(req.params.id.substring(1));
    let product = await product_db.all(`SELECT * FROM products WHERE product_id = ${product_id}`);
    await product_db.close();
    
    readFile('comment.json', 'utf-8', (err, data) => {
        if(err) {
            console.log('Unable to read comment.json file: ', err);
            return;
        }
        const parsed_data = JSON.parse(data);
        console.log(parsed_data[product[0].product_id-1]);
        res.render('display_product', {
            product: product[0],
            comments: parsed_data[product[0].product_id-1]["comments"]
        });
    })
    // res.render('display_product', { product: product[0] })
});

router.post('/update_comment', (req, res) => {
    if(req.body?.comment.trim().length === 0) {
        res.redirect(`/product/:${req.body.id}`);
        return;
    }
    readFile('comment.json', 'utf-8', (err, data) => {
        if(err) {
            console.log('Unable to read comment.json file: ', err);
            return;
        }
        const parsed_data = JSON.parse(data);
        parsed_data[parseInt(req.body?.id)-1]["comments"].push(req.body?.comment);
        writeFile('comment.json', JSON.stringify(parsed_data, null, 2), (err) => {
            if(err) {
                console.log('Unable to write comment.json file: ', err);
                return;
            }
            
        });
        res.redirect(`/product/:${req.body.id}`);
    })
});

module.exports = router;