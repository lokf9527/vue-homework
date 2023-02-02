import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = {};
let delProductModal = {};

const app = {
data() {
return {
apiUrl: "https://vue3-course-api.hexschool.io",
apiPath: "ph",
products: [],
tempProduct: {
imagesUrl: []
},
isNew: false, //用來確認是新增還是編輯產品
}

    },
    methods: {
        checklogin() {
            const url = `${this.apiUrl}/v2/api/user/check`;
            axios.post(url).then(() => {
                 this.getProducts();
            }).catch((err) => {
                alert(err.data.message);
                window.location = "login.html";
            })
        },
        getProducts(){
            const url = `${this.apiUrl}/v2/api/${this.apiPath}/admin/products/all`;
            axios.get(url).then((res)=>{
                this.products = res.data.products;
            })
        },
        openModal(status,product){
            if(status === "create"){
                productModal.show();
                this.isNew = true;
                this.tempProduct={
                    imagesUrl: []
                }
            }else if(status === "edit"){
                productModal.show();
                this.isNew = false;
                this.tempProduct = {...product};
            }else if(status === "delete"){
                delProductModal.show();
                this.tempProduct = {...product};
            }
        },
        updateProduct(){
            let url =`${this.apiUrl}/v2/api/${this.apiPath}/admin/product`;
            let method= "post";
            if(!this.isNew){
                url=`${this.apiUrl}/v2/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                method= "put";
            }

            axios[method](url).then(()=>{
                this.getProducts();
                productModal.hide();
            })
        },
        deleteProduct(){
            const url =`${this.apiUrl}/v2/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url).then(()=>{
                this.getProducts();
                delProductModal.hide();
            })
        }
    },
    mounted() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)ph\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;

        this.checklogin();
        this.getProducts();

        // Bootstrap 方法
        // 1.初始化 new
        // 2.呼叫方法 .show, hide
        productModal= new bootstrap.Modal("#productModal");
        delProductModal= new bootstrap.Modal("#delProductModal");
    },

}
createApp(app).mount("#app")