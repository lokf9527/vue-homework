// import {createApp} from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js"

const {defineRule, Form, Field, ErrorMessage,configure } = VeeValidate;
const {required,email } = VeeValidateRules;
const { localize, loadLocaleFromURL} = VeeValidateI18n;
const apiUrl = "https://vue3-course-api.hexschool.io";
const apiPath = "ph";
defineRule('required', required);
defineRule('email', email);


const productModal={
    // 當id變動時，取得遠端資料，並呈現modal
    props:["id","addToCart","openModal"],
    data(){
        return{
            modal:{},
            tempProduct:{},
            qty:1,
            
        };

    },
    template:"#userProductModal",
    watch:{
        id(){
            if(this.id){
                axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
            .then((res)=>{
                this.tempProduct=res.data.product;
                this.modal.show();
            }).catch((err) => {
                alert(err.data.message);
              });
            }
            
        }
    },
    methods:{
        hide(){
            this.modal.hide()
        }
    },
    mounted(){
        this.modal=new bootstrap.Modal(this.$refs.modal);
        this.$refs.modal.addEventListener("hidden.bs.modal",(event)=>{
            this.openModal("");
        })
    }
}

Vue.createApp ({
    data(){
        return{
            products:[],
            productId:"",
            cart:{},
            loadingItem:"",
            addCartLoading:null,
            data: {
                user: {
                  email: "",
                  name: "",
                  tel: "",
                  address: "",
                },
                message: "",
              },
        }
    },
    methods:{
        getProducts(){
            axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
            .then((res)=>{
                this.products=res.data.products;
            }).catch((err) => {
                alert(err.data.message);
              });
        },
        openModal(id){
            this.productId=id;
            
        },
        addToCart(product_id,qty = 1){
            const data={
                product_id,
                qty,
            };
            this.addCartLoading = product_id;
            axios.post(`${apiUrl}/v2/api/${apiPath}/cart`,{data})
            .then((res)=>{
                alert(res.data.message);
                this.$refs.productModal.hide();
                this.getCarts();
                this.addCartLoading = null;
            }).catch((err)=>{
                alert(err.data.message)
            })
        },
        getCarts(){
            axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
            .then((res)=>{
                this.cart=res.data.data;
            })
            .catch((err) => {
                alert(err.data.message);
              });
        },
        updateCarts(item){
            const data={
                product_id:item.product.id,
                qty:item.qty,
            };
            this.loadingItem=item.id;
            axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`,{data})
            .then(()=>{
                this.getCarts();
                this.loadingItem="";
            })
            .catch((err) => {
                alert(err.data.message);
              });
        },
        deleteCarts(item){
            this.loadingItem=item.id;
            axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`)
            .then(()=>{
                this.getCarts();
                this.loadingItem="";
            })
            .catch((err) => {
                alert(err.data.message);
              });
        },
        deleteAllCarts() {
            axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`)
              .then(() => {
                alert("已清空購物車");
                this.getCarts();
              })
              .catch((err) => {
                alert(err.data.message);
              });
          },
        createtOrder(){
            const data = this.data;
            axios.post(`${apiUrl}/v2/api/${apiPath}/order`,{data})
            .then((res)=>{
                alert(res.data.message);
                this.$refs.form.resetForm();
                this.data.message = "";
                this.getCarts();
            }).catch((err)=>{
                alert(err.data.message)
            })
        }
    },
    components:{
        productModal,
        VForm:Form,
        VField:Field,
        ErrorMessage:ErrorMessage,
    },
    mounted(){
        this.getProducts();
        this.getCarts();
    },
}).mount("#app")

// VueValidate
  Object.keys(VeeValidateRules).forEach(rule => {
      if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
      }
  });
  VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

  // Activate the locale
  VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
  });

// app.component('VForm', VeeValidate.Form);
// app.component('VField', VeeValidate.Field);
// app.component('ErrorMessage', VeeValidate.ErrorMessage);
// app.mount("#app")