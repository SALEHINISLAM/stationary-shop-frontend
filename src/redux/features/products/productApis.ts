import { baseApi } from "../../api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (productInfo) => ({
        url: '/stationary-product/product',
        method: 'POST',
        body: productInfo,
      }),
      invalidatesTags: ['product']
    }),
    getAllProducts: builder.query({
      query: ({ page, limit, searchQuery, sort, priceSort, minPrice, maxPrice, categories }) => ({
        url: "/stationary-product/products",
        method: "GET",
        params: {
          page,
          limit,
          searchQuery,
          sort,
          priceSort,
          minPrice,
          maxPrice,
          categories: categories?.length ? categories.join(",") : undefined,
        },
      }),
      providesTags: ['product'],
    }),
    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/stationary-product/products/${id}`,
        method: "GET",
      }),
      providesTags: ['product']
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/stationary-product/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/stationary-product/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['product'],
    }),
  })
})

export const { useAddProductMutation, useGetAllProductsQuery, useGetSingleProductQuery,useUpdateProductMutation,useDeleteProductMutation } = productApi;