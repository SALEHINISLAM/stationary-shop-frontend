import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../../redux/hooks";
import { Card, Typography, Button, CardContent } from "@mui/material";
import { Product } from "../../../../../redux/features/products/productSlice";
import { handleImageError } from "../../../../../utilis/handleErrorImage";
import { useGetSingleProductQuery } from "../../../../../redux/features/products/productApis";
import LoadingScreen from "../../../../../components/loading";
import { Link } from "react-router-dom";

export default function GetSingleProduct() {
  const { id } = useParams<{ id: string }>(); // Type the params
  const products = useAppSelector((state) => state.product.products);

  // Check if the product exists in the persisted store
  const persistedProduct = products.find((product) => product._id === id);

  // Only fetch from server if product isn't in persisted store
  const { data, isLoading } = useGetSingleProductQuery(id as string, {
    skip: !!persistedProduct, // Skip the query if persistedProduct exists
  });

  // Use persisted product if available, otherwise use fetched data
  const product: Product | undefined = persistedProduct || data;

  if (isLoading && !persistedProduct) {
    return <LoadingScreen />;
  }

  if (!product) {
    return (
      <Typography variant="h6" color="error" className="text-center py-10">
        Product not found
      </Typography>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h4" className="font-bold mb-6">
        Product Details
      </Typography>
      <Card>
        <div className=" overflow-hidden">
          <img
            src={product.photo}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
        <CardContent>
          <Typography variant="h5" className="font-semibold">
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Brand: {product.brand}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Description: {product.description}
          </Typography>
          <Typography variant="body1" className="font-bold mt-2">
            Price: ৳{product.price}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Category: {product.category}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quantity: {product.quantity}
          </Typography>
          <Typography variant="body1" color={product.inStock ? "green" : "red"}>
            Status: {product.inStock ? "In Stock" : "Out of Stock"}
          </Typography>
          <div className="mt-4 flex gap-2">
            <Button
              component={Link}
              to="/dashboard/admin/all-products"
              variant="outlined"
              color="primary"
            >
              Back to Products
            </Button>
            <Button
              component={Link}
              to={`/dashboard/admin/update-product/${product._id}`}
              variant="contained"
              color="secondary"
            >
              Update Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
