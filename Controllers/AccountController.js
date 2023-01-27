const Wallet = require("../Models/Wallet");
const Transaction = require("../Models/Transaction");
const { response } = require("../app");

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

exports.recharge = (req, res, next) => {
  Wallet.findOne({ id: req.auth.userId })
    .then((r) => {
      const txn_id = "";
      if (r) {
        const has_bal = r.balance;
        const req_bal = +req.body.balance; // you can use the + operator to convert a string to a number.
        const total_bal = has_bal + req_bal;

        // console.log(total_bal);
        Wallet.findOneAndUpdate(
          { user_id: req.auth.userId },
          { balance: total_bal },
          { new: true }
        )
          .then((update) => {
            this.transaction(
              req.auth.userId,
              update._id,
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

exports.transaction = (fs, se, th, fr, txn_id) => {
  return new Transaction({
    user_id: fs,
    wallet_id: se,
    type: th,
    type_value: fr,
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
