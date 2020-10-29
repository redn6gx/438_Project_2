var express = require('express');
var router = express.Router();
var mysql = require("mysql");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cart');
});

//post method to update product quantity
router.post("/updateQuantity",function (req, res, next) {
  let amountBought = req.body.amountBought;
  let gameName = req.body.gameName;

  const dconnection = mysql.createConnection({
    host: 'sm9j2j5q6c8bpgyq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'fj0s4at6opd6jmr1',
    password: 'y8obdfsq33pao6n4',
    database: 'gjld626l6whec08k'
  });
  dconnection.connect();
  dconnection.query(`
    UPDATE Game 
    SET quantity = quantity-"${amountBought}"
    WHERE name = "${gameName}"
    `,function(error, results, fields){
        console.log(error);
        if (error) throw error;
          res.json({
            response: "Successfully Updated Quantity"
          });
      }
  );
});

module.exports = router;