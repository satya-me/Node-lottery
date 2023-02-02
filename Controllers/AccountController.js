const Wallet = require("../Models/Wallet");
const Transaction = require("../Models/Transaction");
const { response, map } = require("../app");
var axios = require("axios");
const jwt = require("jsonwebtoken");

exports.balance = (req, res, next) => {
  console.log("Auth", req.auth);
  Wallet.findOne({ user_id: req.auth.userId })
    .then((response) => {
      //   console.log(response);
      if (response == null) {
        res.status(200).json({
          user_id: req.auth.userId,
          balance: null,
        });
      } else {
        res.status(200).json({
          user_id: req.auth.userId,
          balance: response.balance,
        });
      }
    })
    .catch((error) => {
      res.status(200).json(error);
    });

  //   res.status(200).json({ ballance: 560 });
};

exports.transaction = (fs, se, th, fr, txn_id) => {
  return new Transaction({
    user_id: fs,
    wallet_id: se,
    type: th,
    amount: fr,
    transaction_id: txn_id,
  })
    .save()
    .then((tran) => {
      return tran;
    })
    .catch((err_tran) => {
      //   console.log(err_tran);
      return err_tran;
    });
};

exports.init = (req, res) => {
  //
  // token
  // payment_token
  // payment_url
  const token = req.headers.authorization.split(" ")[1];

  const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");

  // console.log("amount ",req);

  new Transaction({
    user_id: decoded.userId,
    payment_token: req.body.payment_token,
    payment_url: req.body.payment_url,
    merchant: "CinetPay",
    wallet_id: "",
    type: "",
    message: "",
    amount: "",
    currency: "",
    status: "Init",
    payment_method: "",
    description: "",
    metadata: "",
    operator_id: "",
    payment_date: "",
    transaction_id: "",
    token: "",
    get_status: "",
  })
    .save()
    .then((tran) => {
      this.CinetPay({ token: tran.payment_token, flag: "self" });
      res.status(200).json(tran);
    })
    .catch((err) => {
      //   console.log(err_tran);
      res.status(400).json(err);
    });
  // res.status(200).json();
};

exports.CinetPay = (req, res) => {
  //
  console.log("SATYA ");
  let _token = "";
  if (req.flag === "self") {
    _token = req.token;
  } else {
    _token = req.body.token;
  }

  var data = JSON.stringify({
    // transaction_id: req.body.transaction_id, // 32460244 //86407550 ->meta
    token: _token,
    site_id: "126127",
    apikey: "102219127563b7f7c53a41e9.62135970",
  });

  var config = {
    method: "post",
    url: "https://api-checkout.cinetpay.com/v2/payment/check",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  // console.log("conf ", JSON.parse(config.data).token);
  axios(config)
    .then(function (response) {
      console.log(response);
      let flag = "true";
      if (response.data.data.status == "ACCEPTED") {
        const user_token = response.data.data.metadata;
        const decoded = jwt.verify(user_token, "RANDOM_TOKEN_SECRET");
        flag = "false";
        // wallet update function
        const arg = {
          id: decoded.userId,
          amount: response.data.data.amount,
          flag: "self",
        };
        Transaction.find({ user_id: decoded.userId }).then((resp) => {
          resp.map((item) => {
            if (item.status === "ACCEPTED" && item.status_call_req === "true") {
              // console.log(item.payment_url);
              // this.CinetPay({ token: item.payment_token, flag: "self" });
              let _user_id = arg.id;
              let _amount = arg.amount;
              Wallet.findOne({ id: _user_id })
                .then((r) => {
                  const txn_id = "";
                  if (r) {
                    const has_bal = r.balance;
                    const req_bal = +_amount; // you can use the + operator to convert a string to a number.
                    const total_bal = has_bal + req_bal;
                    Wallet.findOneAndUpdate(
                      { user_id: _user_id },
                      { balance: total_bal },
                      { new: true }
                    )
                      .then((update) => {
                        console.log(update);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } else {
                    // console.log("no bal");
                    const balance = new Wallet({
                      user_id: _user_id,
                      balance: _amount,
                    });
                    balance
                      .save()
                      .then((save) => {
                        console.log("First recharge bal");
                      })
                      .catch((err) => {
                        console.log({
                          message: "Error! with recharge!",
                          error: err,
                        });
                      });
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          });
        });
      }
      if (response.data.data.status == "REFUSED") {
        flag = "false";
      }
      Transaction.updateOne(
        { payment_token: _token },
        {
          $set: {
            amount: response.data.data.amount,
            status: response.data.data.status,
            currency: response.data.data.currency,
            status: response.data.data.status,
            payment_method: response.data.data.payment_method,
            metadata: response.data.data.metadata,
            operator_id: response.data.data.operator_id,
            payment_date: response.data.data.payment_date,
            status_call_req: flag,
          },
        }
      ).then((su) => {
        if (req.flag === "self") {
          console.log(su);
        } else {
          res.status(200).json(su);
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  // res.status(200).json(req.body);
};

exports.getTransaction = (req, res) => {
  //

  const token = req.headers.authorization.split(" ")[1];

  const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");

  Transaction.find({ user_id: decoded.userId }).then((resp) => {
    res.status(200).json(resp);
  });
};

exports.UpdateTnx = (req, res) => {
  // fetch all transaction for this user
  // console.log({ token: req.headers.authorization });

  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");

  Transaction.find({ user_id: decoded.userId }).then((resp) => {
    let c = 1;
    resp.map((item) => {
      if (item.status === "ACCEPTED" && item.status_call_req === "true") {
        // console.log(item.payment_url);
        var data = JSON.stringify({
          // transaction_id: req.body.transaction_id, // 32460244 //86407550 ->meta
          token: item.payment_token,
          site_id: "126127",
          apikey: "102219127563b7f7c53a41e9.62135970",
        });

        var config = {
          method: "post",
          url: "https://api-checkout.cinetpay.com/v2/payment/check",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };
        axios(config).then(function (response) {
          if (
            response.data.data.status == "ACCEPTED" &&
            item.status_call_req === "true"
          ) {
            const user_token = response.data.data.metadata;
            const decoded = jwt.verify(user_token, "RANDOM_TOKEN_SECRET");

            // wallet update function
            Transaction.updateOne(
              { payment_token: item.payment_token },
              {
                $set: {
                  amount: response.data.data.amount,
                  status: response.data.data.status,
                  currency: response.data.data.currency,
                  status: response.data.data.status,
                  payment_method: response.data.data.payment_method,
                  metadata: response.data.data.metadata,
                  operator_id: response.data.data.operator_id,
                  payment_date: response.data.data.payment_date,
                  status_call_req: "false",
                },
              }
            ).then((succ) => {
              Wallet.findOne({ user_id: decoded.userId })
                .then((r) => {
                  console.log(r);
                  if (r) {
                    const has_bal = r.balance;
                    const req_bal = +response.data.data.amount; // you can use the + operator to convert a string to a number.
                    const total_bal = has_bal + req_bal;
                    Wallet.findOneAndUpdate(
                      { user_id: decoded.userId },
                      { balance: total_bal },
                      { new: true }
                    )
                      .then((update) => {
                        console.log(update);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } else {
                    // console.log("no bal");
                    const balance = new Wallet({
                      user_id: decoded.userId,
                      balance: +response.data.data.amount,
                    });
                    balance
                      .save()
                      .then((save) => {
                        console.log("First recharge bal");
                      })
                      .catch((err) => {
                        console.log({
                          message: "Error! with recharge!",
                          error: err,
                        });
                      });
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            });
          }
          if (response.data.data.status == "REFUSED") {
            flag = "false";
            Transaction.updateOne(
              { payment_token: _token },
              {
                $set: {
                  amount: response.data.data.amount,
                  status: response.data.data.status,
                  currency: response.data.data.currency,
                  status: response.data.data.status,
                  payment_method: response.data.data.payment_method,
                  metadata: response.data.data.metadata,
                  operator_id: response.data.data.operator_id,
                  payment_date: response.data.data.payment_date,
                  status_call_req: flag,
                },
              }
            ).then((su) => {
              
            });
          }
        });
      }
    });
  });
};

exports.Recharge = (req, res) => {
  let _user_id = "";
  let _amount = "";
  if (req.flag === "self") {
    _user_id = req.id;
    _amount = req.amount;
  } else {
    _user_id = req.auth.userId;
    _amount = req.body.balance;
  }
  Wallet.findOne({ id: _user_id })
    .then((r) => {
      const txn_id = "";
      if (r) {
        const has_bal = r.balance;
        const req_bal = +_amount; // you can use the + operator to convert a string to a number.
        const total_bal = has_bal + req_bal;

        // this.CinetPay(req);

        // res.status(200).json(_user_id);

        Wallet.findOneAndUpdate(
          { user_id: _user_id },
          { balance: total_bal },
          { new: true }
        )
          .then((update) => {
            this.transaction(_user_id, update._id, "Recharge", _amount, txn_id)
              .then((response) => {
                console.log(response);
                res.status(201).json({
                  user_id: _user_id,
                  // txn_id: response._id,
                  recharge_amount: _amount,
                  total_balance: total_bal,
                });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        // console.log("no bal");
        const balance = new Wallet({
          user_id: req.auth.userId,
          balance: req.body.balance,
        });
        balance
          .save()
          .then((save) => {
            console.log("First recharge bal");
            // console.log(save);
            this.transaction(
              req.auth.userId,
              save._id,
              "Recharge",
              req.body.balance,
              txn_id
            )
              .then((response) => {
                console.log(response);
                res.status(201).json({
                  user_id: req.auth.userId,
                  // txn_id: response._id,
                  recharge_amount: req.body.balance,
                  total_balance: req.body.balance,
                });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((err) => {
            console.log({ message: "Error! with recharge!", error: err });
          });
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.BallUpdate = (arg) => {
  var data = JSON.stringify({
    // transaction_id: req.body.transaction_id, // 32460244 //86407550 ->meta
    token: _token,
    site_id: "126127",
    apikey: "102219127563b7f7c53a41e9.62135970",
  });

  var config = {
    method: "post",
    url: "https://api-checkout.cinetpay.com/v2/payment/check",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  // console.log("conf ", JSON.parse(config.data).token);
  axios(config)
    .then(function (response) {
      console.log(response);
      let flag = "true";
      if (response.data.data.status == "ACCEPTED") {
        const user_token = response.data.data.metadata;
        const decoded = jwt.verify(user_token, "RANDOM_TOKEN_SECRET");
        flag = "false";
        // wallet update function
        const arg = {
          id: decoded.userId,
          amount: response.data.data.amount,
          flag: "self",
        };
        Transaction.find({ user_id: decoded.userId }).then((resp) => {
          resp.map((item) => {
            if (item.status === "ACCEPTED" && item.status_call_req === "true") {
              // console.log(item.payment_url);
              // this.CinetPay({ token: item.payment_token, flag: "self" });
              let _user_id = arg.id;
              let _amount = arg.amount;
              Wallet.findOne({ id: _user_id })
                .then((r) => {
                  const txn_id = "";
                  if (r) {
                    const has_bal = r.balance;
                    const req_bal = +_amount; // you can use the + operator to convert a string to a number.
                    const total_bal = has_bal + req_bal;
                    Wallet.findOneAndUpdate(
                      { user_id: _user_id },
                      { balance: total_bal },
                      { new: true }
                    )
                      .then((update) => {
                        console.log(update);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } else {
                    // console.log("no bal");
                    const balance = new Wallet({
                      user_id: _user_id,
                      balance: _amount,
                    });
                    balance
                      .save()
                      .then((save) => {
                        console.log("First recharge bal");
                      })
                      .catch((err) => {
                        console.log({
                          message: "Error! with recharge!",
                          error: err,
                        });
                      });
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          });
        });
      }
      if (response.data.data.status == "REFUSED") {
        flag = "false";
      }
      Transaction.updateOne(
        { payment_token: _token },
        {
          $set: {
            amount: response.data.data.amount,
            status: response.data.data.status,
            currency: response.data.data.currency,
            status: response.data.data.status,
            payment_method: response.data.data.payment_method,
            metadata: response.data.data.metadata,
            operator_id: response.data.data.operator_id,
            payment_date: response.data.data.payment_date,
            status_call_req: flag,
          },
        }
      ).then((su) => {
        if (req.flag === "self") {
          console.log(su);
        } else {
          res.status(200).json(su);
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};
