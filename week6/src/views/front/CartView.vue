<template>
    這是購物車頁面
    <!-- 購物車列表 -->
    <div class="text-end">
        <button class="btn btn-outline-danger" type="button" @click="deleteAllCarts()">清空購物車</button>
                </div>
                <table class="table align-middle">
                    <thead>
                        <tr>
                            <th></th>
                            <th>品名</th>
                            <th style="width: 150px">數量/單位</th>
                            <th>單價</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="cart.carts">
                            <tr v-for="item in cart.carts" :key="item.id">
                                <td>
                                    <button type="button" class="btn btn-outline-danger btn-sm"
                                        :disabled="item.id === loadingItem" @click="deleteCarts(item)">
                                        <i class="fas fa-spinner fa-pulse" v-if="item.Id===loadingItem"></i>
                                        <span v-else>x</span>
                                    </button>
                                </td>
                                <td>
                                    {{item.product.title }}
                                    <!-- <div class="text-success">
                                        已套用優惠券
                                    </div> -->
                                </td>
                                <td>
                                    <div class="input-group input-group-sm">
                                        <!-- <div class="input-group mb-3">
                                            <input min="1" type="number" class="form-control">
                                            <span class="input-group-text" id="basic-addon2">{{ }}</span>
                                        </div> -->
                                        <select name="" id="" class="form-select" v-model="item.qty"
                                            :disabled="item.id === loadingItem" @change="updateCarts(item)">
                                            <option :value="i" v-for="i in 10" :key="i + '123'">{{i}}</option>
                                        </select>
                                    </div>
                                </td>
                                <td class="text-end">
                                    <!-- <small class="text-success">折扣價：</small> -->
                                    {{item.total }}
                                </td>
                            </tr>
                        </template>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-end">總計</td>
                            <td class="text-end">{{ cart.total}}</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-end text-success">折扣價</td>
                            <td class="text-end text-success">{{cart.final_total }}</td>
                        </tr>
                    </tfoot>
                </table>
</template>

<script>
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  data () {
    return {
      products: [],
      productId: '',
      cart: {},
      loadingItem: '',
      addCartLoading: null,
      data: {
        user: {
          email: '',
          name: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    }
  },
  methods: {
    getProducts () {
      this.$http.get(`${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/products/all`)
        .then((res) => {
          this.products = res.data.products
        }).catch((err) => {
          alert(err.data.message)
        })
    },
    getCarts () {
      this.$http.get(`${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/cart`)
        .then((res) => {
          this.cart = res.data.data
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    updateCarts (item) {
      const data = {
        product_id: item.product.id,
        qty: item.qty
      }
      this.loadingItem = item.id
      this.$http.put(`${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/cart/${item.id}`, { data })
        .then(() => {
          this.getCarts()
          this.loadingItem = ''
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    deleteCarts (item) {
      this.loadingItem = item.id
      this.$http.delete(`${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/cart/${item.id}`)
        .then(() => {
          this.getCarts()
          this.loadingItem = ''
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    deleteAllCarts () {
      this.$http.delete(`${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/carts`)
        .then(() => {
          alert('已清空購物車')
          this.getCarts()
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    createtOrder () {
      const data = this.data
      this.$http.post(`${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/order`, { data })
        .then((res) => {
          alert(res.data.message)
          this.$refs.form.resetForm()
          this.data.message = ''
          this.getCarts()
        })
        .catch((err) => {
          alert(err.data.message)
        })
    }
  },
  mounted () {
    this.getCarts()
  }
}
</script>
