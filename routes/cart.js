var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cart');
});


//maybe pass the pk of the product from productPage to here first
//then save the pk in a list in here
//when you switch to shopping cart use ajax call to pull list of pk's and use those to pull products from db
//


//recieved from productPageCode.js

//  router.get("/addToCart", function(req, res, next) {
//     let productTitle = req.body.productTitle;
//     let productPrice = req.body.productPrice;
//     // let productQuantity = req.body.productQuantity;
//     let productImage = req.body.productImage;
//     addItemToCart(productTitle, productPrice, productImage);
//     updateCartTotal();
//  });

//send to cartCode.js



module.exports = router;