import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Pagination,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useDeleteProductMutation, useGetAllProductsQuery } from "../../../../redux/features/products/productApis";
import LoadingScreen from "../../../../components/loading";
import { Link } from "react-router-dom";
import {
  Product,
  setProducts,
} from "../../../../redux/features/products/productSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { handleImageError } from "../../../../utilis/handleErrorImage";

const categoriesList = [
  "Writing",
  "Office Supplies",
  "Art Supplies",
  "Educational",
  "Technology",
];

export default function AllProducts() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState(-1); // -1 for newest, 1 for oldest
  const [priceSort, setPriceSort] = useState<number | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<string[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  // Determine if we should skip the API call
  const persistedProducts = useAppSelector((state) => state.product.products);

  const { data, isLoading, isError,refetch } = useGetAllProductsQuery(
    {
      page,
      limit,
      searchQuery,
      sort,
      priceSort,
      minPrice,
      maxPrice,
      categories,
    },
    { refetchOnMountOrArgChange: true }
  );
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  useEffect(() => {
    if (data?.data?.result) {
      dispatch(setProducts(data.data.result));
    }
  }, [data, dispatch]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleSortChange = (
    e: SelectChangeEvent<"newest" | "oldest" | "lowToHigh" | "highToLow">
  ) => {
    const value = e.target.value as
      | "newest"
      | "oldest"
      | "lowToHigh"
      | "highToLow";
    if (value === "newest" || value === "oldest") {
      setSort(value === "newest" ? -1 : 1);
      setPriceSort(undefined);
    } else {
      setPriceSort(value === "lowToHigh" ? 1 : -1);
      setSort(-1);
    }
    setPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPage(1);
  };

  const handlePriceFilter = () => {
    setPage(1);
  };

  const handleDeleteProduct = async (id: string) => {
    console.log(id);
    setProductIdToDelete(id); // Set the product ID to delete
    setOpenDeleteModal(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    if (productIdToDelete) {
      try {
        await deleteProduct(productIdToDelete).unwrap(); // Call the delete API
        setOpenDeleteModal(false); // Close the modal
        setProductIdToDelete(null); // Clear the ID
        refetch(); // Refetch the product list to update UI
      } catch (error) {
        console.error("Failed to delete product:", error);
        // Optionally, show an error message to the user
      }
    }
  };
  const cancelDelete = () => {
    setOpenDeleteModal(false);
    setProductIdToDelete(null);
  };

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return (
      <div className="text-red-500 text-center py-10">
        Error loading products
      </div>
    );

  const products: Product[] =
    persistedProducts.length > 0 ? persistedProducts : data?.data?.result || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">All Products</h1>

        <div className="flex flex-col gap-6">
          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <Box sx={{ width: { xs: "100%", md: "300px" } }}>
              <TextField
                fullWidth
                label="Search Products"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by name, brand, or description"
              />
            </Box>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={
                  priceSort === 1
                    ? "lowToHigh"
                    : priceSort === -1
                    ? "highToLow"
                    : sort === -1
                    ? "newest"
                    : "oldest"
                }
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
                <MenuItem value="highToLow">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-2">
            <Typography variant="h6" className="font-semibold">
              Categories
            </Typography>
            <div className="flex flex-wrap gap-4">
              {categoriesList.map((category) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                  }
                  label={category}
                />
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Box sx={{ width: { xs: "100%", sm: "200px" } }}>
              <TextField
                fullWidth
                label="Min Price"
                variant="outlined"
                type="number"
                value={minPrice || ""}
                onChange={(e) =>
                  setMinPrice(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                slotProps={{
                  input: {
                    startAdornment: <span className="pr-2">৳</span>,
                  },
                }}
              />
            </Box>
            <Box sx={{ width: { xs: "100%", sm: "200px" } }}>
              <TextField
                fullWidth
                label="Max Price"
                variant="outlined"
                type="number"
                value={maxPrice || ""}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                slotProps={{
                  input: {
                    startAdornment: <span className="pr-2">৳</span>,
                  },
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={handlePriceFilter}
              className="bg-blue-600 hover:bg-blue-700"
              sx={{ height: "56px", px: 4 }}
            >
              Apply Price Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Typography className="text-center text-gray-500 py-10">
          No products found
        </Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={product.photo || "/src/assets/card-hoto.avif"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <CardContent>
                <Typography variant="h6" className="font-semibold truncate">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.brand}
                </Typography>
                <Typography variant="body1" className="font-bold mt-2">
                  ৳{product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.category}
                </Typography>
                <div className="mt-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    Qty: {product.quantity}
                  </span>
                </div>
              </CardContent>
              <div className="flex gap-1 flex-row m-1">
                <Link
                  className="w-1/2"
                  to={`/dashboard/admin/all-products/${product._id}`}
                >
                  <Button
                    variant="contained"
                    className="bg-blue-600 hover:bg-blue-700 w-full"
                    sx={{ mb: 2 }}
                  >
                    View Details
                  </Button>
                </Link>
                <Link
                  to={`/dashboard/admin/update-product/${product._id}`}
                  className="w-1/2"
                >
                  <Button
                    variant="contained"
                    className="bg-blue-600 hover:bg-blue-700 w-full"
                    sx={{ mb: 2 }}
                  >
                    Update Product
                  </Button>
                </Link>
              </div>
              <Button
                variant="contained"
                className="bg-red-600 w-full hover:bg-blue-700"
                sx={{ mb: 2 }}
                color="error"
                onClick={() => handleDeleteProduct(product._id)}
                disabled={isDeleting}
              >
                {isDeleting && productIdToDelete === product._id ? "Deleting..." : "Delete Product"}
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            size="large"
            className="shadow-sm"
          />
        </div>
      )}
      <Dialog
        open={openDeleteModal}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this product? This action is permanent and cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
