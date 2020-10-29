var express = require('express');
var router = express.Router();
var mysql = require("mysql");

/* GET home page. */
router.get('/', function(req, res, next) {
  let gitem = [];
  
  const dconnection = mysql.createConnection({
    host: 'sm9j2j5q6c8bpgyq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'fj0s4at6opd6jmr1',
    password: 'y8obdfsq33pao6n4',
    database: 'gjld626l6whec08k'
  });
  dconnection.connect();
  dconnection.query(`
    SELECT * FROM Game
    `, function(error, results, fields){
      if(error) throw error;
      for (i in results){
        gitem[i] = results[i];

      }
      res.render('homepage', {
        title: 'Gaming Collection Shop',
        item: gitem
      })
    }
  );
  dconnection.end();

});

//Post
router.post("/homepage", function(req, res, next){
  console.log("entering the post route")
  const dconnection = mysql.createConnection({
    host: 'sm9j2j5q6c8bpgyq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'fj0s4at6opd6jmr1',
    password: 'y8obdfsq33pao6n4',
    database: 'gjld626l6whec08k'
  });
  dconnection.connect();
  dconnection.query(`
    SELECT * FROM Game WHERE name = ?`, [req.body.keyword],
    function(error, results, fields){
      if(error) throw error;
      res.json({
        response: "Successfully Retrieved Game",
        item: results
      });
    }
  );
  dconnection.end();
});

module.exports = router;

