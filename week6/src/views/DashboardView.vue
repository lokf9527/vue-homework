<template>
    這是後台頁面
    <router-link to="/admin/orders">後台產品列表</router-link> |
    <router-link to="/admin/products">後台訂單列表</router-link>|
    <router-link to="/">回到前台首頁</router-link>|
    <a href="#" @click.prevent="logout">登出</a>
    <hr>
    <RouterView></RouterView>
</template>

<script>
import { RouterView } from 'vue-router'
const { VITE_APP_URL } = import.meta.env
export default {
  components: {
    RouterView
  },
  methods: {
    logout () {
      document.cookie = `phtoken=;expires=${new Date()};`
      this.$router.push('/login')
    },
    checkLogin () {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)ph\s*=\s*([^;]*).*$)|^.*$/, '$1')
      this.$http.defaults.headers.common.Authorization = token
      this.$http.post(`${VITE_APP_URL}/v2/api/user/check`)
        .then((res) => {
          console.log(res)
          if (!res.data.success) {
            this.$router.push('/login')
          }
        })
    }
  },
  mounted () {
    this.checkLogin()
  }
}
</script>
