exports.createCheckoutSession = async (req, res) => {
  try {
    const callbackUrl = req.body.callbackUrl

    const pricingPlanId = req.body.pricingPlanId

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

    const { Firestore, Timestamp } = require("@google-cloud/firestore")

    const db = new Firestore({
      projectId: process.env.PROJECT_ID,
      keyFilename: `./service-accounts/${process.env.SERVICE_ACCOUNT_FILE_NAME}`
    })

    const purchaseSession = db.collection("purchaseSessions").doc()

    const checkoutSessionData = {
      status: "決済中",
      created: Timestamp.now(),
      customer: "",
      pricingPlanId
    }

    await purchaseSession.set(checkoutSessionData)

    const sessionConfig = {
      payment_method_types: ["card"],
      success_url: `${callbackUrl}/?purchaseResult=success&purchaseSessionId=${purchaseSession.id}`,
      cancel_url: `${callbackUrl}/?purchaseResult=failed`,
      locale: "ja",
      subscription_data: {
        items: [
          {plan: pricingPlanId}
        ]
      },
      client_reference_id: purchaseSession.id
    }
    
    const session = await stripe.checkout.sessions.create(sessionConfig)

    res.status(200).json({
      id: session.id,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY
    })

  } catch(error) {
    console.error(error)
    res.status(500).json({error: `STRIPE CHECKOUTの初期化に失敗しました: ${error}`})
  }
}
