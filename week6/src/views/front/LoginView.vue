<template>
    這是登入頁面
    <form id="form" class="form-signin" @submit.prevent="login">
        <div class="form-floating mb-3">
            <input type="email" class="form-control" id="username" placeholder="name@example.com"
                v-model="user.username" required autofocus>
            <label for="username">Email address</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="password" placeholder="Password"
                v-model="user.password" required>
            <label for="password">Password</label>
        </div>
        <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
            登入
        </button>
    </form>
</template>

<script>
const { VITE_APP_URL } = import.meta.env
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 放送api至遠端並登入，登入成功儲存cookie，登入失敗跳出錯誤訊息
    login () {
      this.$http.post(`${VITE_APP_URL}v2/admin/signin`, this.user)
        .then((res) => {
          // 取出token,expire並儲存
          const { token, expired } = res.data
          // expired是unix timestamp要用new Date轉型
          document.cookie = `phtoken=${token};expires=${new Date(expired)};`
          // 跳轉至產品頁面
          this.$router.push('/admin/products')
        })
        .catch((err) => {
          alert(err.data.message)
        })
    }
  }
}
</script>
