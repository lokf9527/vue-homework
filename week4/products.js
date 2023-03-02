import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js';
import pagination from "./pagination.js";


let productModal = null;
let delProductModal = null;

const app = createApp({
    data() {
        return {
            apiUrl: "https://vue3-course-api.hexschool.io",
            apiPath: "ph",
            products: [],
            tempProduct: {
            imagesUrl: [],
            },
            isNew: false, //用來確認是新增還是編輯產品
            page:{}
        };
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
        getProducts(page = 1){
            const url = `${this.apiUrl}/v2/api/${this.apiPath}/admin/products/?page=${page}`;
            axios.get(url).then((res)=>{
                this.products = res.data.products;
                this.page = res.data.pagination;
            }).catch((err)=>{
                alert(err.data.message)
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

            axios[method](url,{data:this.tempProduct}).then(()=>{
                this.getProducts();
                productModal.hide();
            }).catch((err)=>{
                alert(err.data.message)
            })
        },
        deleteProduct(){
            const url =`${this.apiUrl}/v2/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url).then(()=>{
                this.getProducts();
                delProductModal.hide();
            }).catch((err)=>{
                alert(err.data.message)
            })
        }
    },
    components:{
        pagination,
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

})
app.component("product-modal",{
    props:["tempProduct","updateProduct","isNew"],
    template:"#product-modal-template",
});
app.mount("#app")
