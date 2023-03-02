import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js"

        const app = {
            data() {
                return {
                    user: {
                        username: "",
                        password: "",
                    }
                }
            },
            methods: {
                login() {
                    const api = "https://vue3-course-api.hexschool.io/v2/admin/signin"
                    axios.post(api, this.user)
                        .then((res) => {
                            const { token, expires } = res.data;
                            document.cookie = `ph=${token}; expires=${new Date(expires)};`
                            window.location = "products.html"
                        }).catch((err) => {
                            alert(err.data.message)
                        })
                }
            },
            mounteds() {

            }
        }
        createApp(app).mount("#app")
