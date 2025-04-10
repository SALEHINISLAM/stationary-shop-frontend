import { baseApi } from "../../api/baseApi";

const productApi=baseApi.injectEndpoints({
    endpoints:(builder)=>({
        addProduct:builder.mutation({
            query:(productInfo)=>({
                url:'/stationary-product/product',
                method:'POST',
                body:productInfo,
            })
        })
    })
})

export const {useAddProductMutation}=productApi;