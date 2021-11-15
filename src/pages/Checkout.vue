<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      success: false,
      message: ""
    }
  },
  mounted() {
    if (this.$route.query.purchaseResult === "success") {
      this.success = true
      this.message = `購入完了 購入ID：${this.$route.query.purchaseSessionId}`
    } else {
      this.message = "購入に失敗しました"
    }
  }
}
</script>

<style>

</style>