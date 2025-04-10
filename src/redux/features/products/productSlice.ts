import { createSlice } from "@reduxjs/toolkit";

export interface Product {
    _id: string;
    name: string;
    photo: string;
    brand: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    inStock: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

type ProductState = {
    products: Product[];
}

const initialState: ProductState = {
    products: [],
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: { 
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex(product => product._id === action.payload._id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(product => product._id !== action.payload);
        },
    },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
export const selectProducts = (state: { product: ProductState }) => state.product.products;
export const selectProductById = (state: { product: ProductState }, productId: string) => {
    return state.product.products.find(product => product._id === productId);
}
export const selectProductsByCategory = (state: { product: ProductState }, category: string) => {
    return state.product.products.filter(product => product.category === category);
}
