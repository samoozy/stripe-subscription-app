exports.initServer = () => {
  const express = require('express')
  const checkout = require('./checkout')
  const webhooks = require('./stripe-webhooks')
  const portal = require('./customer-portal')
  const cors = require('cors')
  const app = express()

  app.use(cors())

  app.route('/').get((req, res) => {
    res.status(200).send("<h1>NODE SERVER IS RUNNING 😋 👍 👾 </h1>")
  })

  app.route("/api/checkout").post(
    express.json(),
    checkout.createCheckoutSession
  )

  app.route("/api/customer-portal").post(
    express.json(),
    portal.createCustomerPortal
  )

  app.route("/stripe-webhooks").post(
    express.raw({type: 'application/json'}),
    webhooks.stripeWebhooks
  )

  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON: ${PORT}`)
  })
};