const mysql = require("mysql");
const jwt = require("jsonwebtoken");

/* Getting the logged in user's username from JWT by passing dummy jwt in headers */

function authenticate(req, res) {
  const token = req.header("token");
  if (!token) {
    return res.send("No token");
  }

  try {
    const decoded = jwt.verify(token, "secret");
    return decoded.user;
  } catch (e) {
    return es.send("Invalid Token");
  }
}

exports.buy = async function (req, res) {
  const user = authenticate(req, res);
  const discount = parseInt(req.body.discount);
  const service = parseInt(req.body.service);

  if (!discount || !service) {
    //Rejecting request if complete infromation is not there. Validations on the correctness of data can also be added
    return res.send("Invalid Body");
  }
  const serviceCharge = ((100 - discount) / 100) * service;

  var connection = mysql.createConnection({
    //Database connection
    host: "db4free.net",
    user: "yesitsmewhoelse",
    password: "9910723368",
    database: "assignment_backe",
  });
  
  connection.connect(function (err) {
    if (err) {
      res.send("Cannot Connect");
    }
  });

  var sql = `SELECT bonus,deposit,winnings FROM wallet WHERE username = '${user}'`;
  connection.query(sql, function (error, result) {
    if (error) {
      res.send(error);
    } else {
      updatebalance(connection, serviceCharge, user, result, res);
    }
  });
};

/* Function to update user wallet details */

function updatebalance(connection, serviceCharge, user, result, res) {
  let { bonus, deposit, winnings } = result[0];

  if ((deposit + winnings + 0.1*bonus) < serviceCharge) {
    return res.send("Insufficient Balance");
  }

  let tempServiceCharge = serviceCharge
  const tempBonus = bonus - (+(0.1 * tempServiceCharge).toFixed(2));

  bonus = tempBonus >= 0 ? tempBonus : 0;
  if (tempBonus < 0) {
    tempServiceCharge = (+(0.9* tempServiceCharge + Math.abs(tempBonus)).toFixed(2));
    bonus = 0;
  } else {
    tempServiceCharge -= 0.1*tempServiceCharge;
    tempServiceCharge = +tempServiceCharge.toFixed(2); 
  }

  if (deposit >= tempServiceCharge) {
    //If whole fee can be recovered using deposit plus bonus money
    deposit -= tempServiceCharge;
  } else {
    tempServiceCharge -= deposit;
    winnings = +(winnings - (+tempServiceCharge.toFixed(2))).toFixed(2);
    console.log(winnings);
    deposit = 0;
  }

  const balance = deposit + winnings + bonus;

  var sql = `UPDATE wallet SET bonus = ${bonus}, deposit = ${deposit}, winnings = ${winnings} WHERE username = '${user}'`;
  connection.query(sql, function (error) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      connection.end();
      res.send({
        status: "Success",
        "Updated Balance": balance,
      });
    }
  });
}
