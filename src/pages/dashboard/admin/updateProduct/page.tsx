import {
  AddAPhoto,
  BrandingWatermark,
  Category,
  Inventory,
  InventoryRounded,
  ProductionQuantityLimits,
  Sell,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "../../../../redux/features/products/productApis";
import { toast } from "sonner";
import { TErrorResponse } from "../../../../types/errorTypes";
import { useEffect } from "react";
import { catagories } from "../addProduct/components/categories";
import LoadingScreen from "../../../../components/loading";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  photo: z.string().url("Invalid URL").min(1, "Photo URL is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().min(0, "Price must be positive"),
  category: z.enum([
    "Writing",
    "Office Supplies",
    "Art Supplies",
    "Educational",
    "Technology",
  ]),
  description: z.string().min(10, "Description is required").trim(),
  quantity: z
    .number()
    .min(0, "Quantity must be positive")
    .int("Quantity must be an integer"),
  inStock: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function UpdateProduct() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSingleProductQuery(id as string);
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      photo: "",
      brand: "",
      price: 0,
      category: "Writing",
      description: "",
      quantity: 0,
      inStock: true,
    },
  });

  useEffect(() => {
    if (data?.data) {
      reset(data.data);
    }
  }, [data, reset]);

  const onSubmit = async (formData: ProductFormData) => {
    const toastId = toast.loading("Updating product...");
    try {
      const updatedData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        inStock: Number(formData.quantity) > 0,
      };
      const result = await updateProduct({ id, data: updatedData }).unwrap();
      if (result.success) {
        toast.success(result.message || "Product updated successfully!", { id: toastId });
      } else {
        toast.error(result.message || "Failed to update product", { id: toastId });
      }
    } catch (err) {
      const apiError = err as TErrorResponse;
      toast.error(apiError.message || "Failed to update product", { id: toastId });
    }
  };

  if (isLoading) {
    return <LoadingScreen/>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 font-semibold">
        Failed to load product
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-3xl text-center">Update Product</h1>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          "& > :not(style)": { m: 1, width: "100%" },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          paddingTop: 5,
        }}
      >
        <div className="flex flex-col md:flex-row justify-between gap-3">
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <Inventory sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              label="Product Name"
              sx={{ width: "100%" }}
              {...register("name")}
              variant="standard"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              required
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <AddAPhoto sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              {...register("photo")}
              error={!!errors.photo}
              helperText={errors.photo?.message}
              label="Photo URL"
              variant="standard"
              required
              sx={{ width: "100%" }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <BrandingWatermark sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              {...register("brand")}
              error={!!errors.brand}
              helperText={errors.brand?.message}
              label="Brand"
              variant="standard"
              sx={{ width: "100%" }}
              required
            />
          </Box>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <Sell sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              label="Price"
              variant="standard"
              sx={{ width: "100%" }}
              type="number"
              {...register("price", { valueAsNumber: true })}
              error={!!errors.price}
              helperText={errors.price?.message}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">Taka</InputAdornment>
                  ),
                },
              }}            
              />
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <Category sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <Controller
              name="category"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <Autocomplete
                  options={catagories}
                  value={value}
                  sx={{ width: "100%" }}
                  onChange={(_, data) => onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      variant="standard"
                      error={!!errors.category}
                      helperText={errors.category?.message}
                      sx={{ width: "100%" }}
                      required
                    />
                  )}
                  {...rest}
                />
              )}
            />
          </Box>
        </div>
        <TextField
          label="Description"
          multiline
          rows={4}
          variant="standard"
          sx={{ width: "100%" }}
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <ProductionQuantityLimits sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              label="Quantity"
              variant="standard"
              type="number"
              {...register("quantity", { valueAsNumber: true })}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              sx={{ width: "100%" }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">Pics</InputAdornment>
                  ),
                },
              }}              
              required
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <InventoryRounded sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <Box>
              <FormLabel component="legend">In Stock</FormLabel>
              <Controller
                name="inStock"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    row
                    {...field}
                    value={field.value ? "true" : "false"}
                    onChange={(e) => field.onChange(e.target.value === "true")}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                  </RadioGroup>
                )}
              />
            </Box>
          </Box>
        </div>
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, width: "100%", maxWidth: "30ch" }}
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Product"}
        </Button>

      </Box>
      <Divider sx={{my:4}}/>
      <Button
      component={Link}
      to='/dashboard/admin/all-products'
      variant="contained"
      >
        Back to All Products
      </Button>
    </div>
  );
}

