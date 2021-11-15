exports.stripeWebhooks = async (req, res) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

    const { Firestore } = require("@google-cloud/firestore")

    const db = new Firestore({
      projectId: process.env.PROJECT_ID,
      keyFilename: `./service-accounts/${process.env.SERVICE_ACCOUNT_FILE_NAME}`
    })

    const signature = req.headers["stripe-signature"]

    const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET)

    if(event.type === "checkout.session.completed") {

      const session = event.data.object

      const batch = db.batch()

      batch.update(db.doc(`purchaseSessions/${session.client_reference_id}`), {status: "決済完了", customer: session.customer})

      await batch.commit()
    }
  
    res.json({ received: true })

  } catch(error) {
    console.error(error)
    res.status(500).json({error: `WEBHOOKでエラーが発生しました: ${error}`})
  }
}
