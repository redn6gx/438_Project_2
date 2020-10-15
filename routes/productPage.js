var express = require('express');
var router = express.Router();
var mysql = require("mysql");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('productPage');
});

//post method for retrieving product from database
router.post("/getProduct", function(req, res, next) {
  // console.log(req.body);
  // let gameName = req.body.gameName;
  const dconnection = mysql.createConnection({
      host: 'sm9j2j5q6c8bpgyq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
      user: 'fj0s4at6opd6jmr1',
      password: 'y8obdfsq33pao6n4',
      database: 'gjld626l6whec08k'
  });
  dconnection.connect();
  dconnection.query(`
    SELECT * FROM Game WHERE name = 'Shaq Fu';
    `, function(error, results, fields){
        console.log(results);
        if (error) throw error;
        res.json({
          response: "Successfully Retrieved Game",
          retrievedGame: results
        });
      }
  );
  dconnection.end();
});

module.exports = router;
