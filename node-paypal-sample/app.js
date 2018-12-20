const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //we runnin sandbox for now
  'client_id': 'AXcXsv-NiUmDaVlILC72cjNxK7QFS4VU1z-5PzLmy2_B_1rTsaGWSm4UE6WWYjAYFY2JGpn_jEiee165',
  'client_secret': 'EIUgzXXR9euB-gS-KQ7IWAzkotFn5l8Kzk01230V8nJ455ZZeeKWs4-wiB2ugD9n-t2g_Bh0LRUzSn_c'
});

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.post('/pay', (req, res) => {

  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/purchase-success",
        "cancel_url": "http://localhost:3000/purchase-cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Hand-delivered 30-rack",
                "sku": "0030",
                "price": "20.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "20.00"
        },
        "description": "Refreshing beverage brought by an NJB"
    }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        console.log("Create Payment Response");
        for(let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.redirect(payment.links[i].href);
          }
        }
    }
  });

});

app.get('/purchase-success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  console.log(payerId);

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": "20.00"
      }
    }]
  };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      console.log("Get Payment Response");
      console.log(JSON.stringify(payment));
      res.send('payment succeded');
    }
  });

});

app.get('/purchase-cancel', (req, res) => {res.send('Cancelled');});

app.listen(3000, () => console.log('Server Started!'));
