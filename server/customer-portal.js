exports.createCustomerPortal = async (req, res) => {
  try {
    const documentId = req.body.documentId

    const returnUrl = req.body.returnUrl

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

    const { Firestore } = require("@google-cloud/firestore")

    const db = new Firestore({
      projectId: process.env.PROJECT_ID,
      keyFilename: `./service-accounts/${process.env.SERVICE_ACCOUNT_FILE_NAME}`
    })

    const purchaseSession = await db.doc(`purchaseSessions/${documentId}`).get()

    const customerId = purchaseSession.data().customer

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    })

    res.status(200).json({
      url: session.url,
      success: true
    })

  } catch(error) {
    console.error(error)
    res.status(500).json({error: `CUSTOMER-PORTALでエラーが発生しました: ${error}`})
  }

}