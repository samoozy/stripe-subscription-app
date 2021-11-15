<template>
  <div>
    <button @click="startSubscriptionCheckoutSession">
      Stripeサブスクリプションに登録する
    </button>
    <input v-model="documentId" type="text">
    <button @click="startCustomerPortalSession">
      Stripeカスタマーポータルを開く
    </button>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js'

export default {
  data() {
    return {
      documentId: ""
    }
  },
  methods: {
    async startSubscriptionCheckoutSession() {
      try {
        const data = {
          pricingPlanId: process.env.VUE_APP_STRIPE_PRICING_PLAN_ID,
          callbackUrl: `${process.env.VUE_APP_FRONT_URL}/stripe-checkout`,
        }
        
        const response = await fetch(`${process.env.VUE_APP_API_URL}/api/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })

        const session = await response.json()

        const stripe = await loadStripe(session.stripePublicKey)

        stripe.redirectToCheckout({sessionId: session.id})

      } catch(error) {
        console.log(error)
        return
      }
    },
    async startCustomerPortalSession() {
      try {
        const data = {
          returnUrl: process.env.VUE_APP_FRONT_URL,
          documentId: this.documentId
        }

        const response = await fetch(`${process.env.VUE_APP_API_URL}/api/customer-portal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })

        const session = await response.json()

        window.location.replace(session.url)

      } catch(error) {
        console.log(error)
        return
      }
    }
  }
}
</script>
