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
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { catagories } from "./components/categories";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddProductMutation } from "../../../../redux/features/products/productApis";
import { toast } from "sonner";
import { TErrorResponse } from "../../../../types/errorTypes";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  photo: z.string().url("Invalid URL").min(1, "Photo URL is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().positive("Price must be positive"),
  category: z.enum(["Writing" , "Office Supplies" , "Art Supplies" , "Educational" , "Technology"]),
  description: z.string().min(1, "Description is required").trim(),
  quantity: z
    .number()
    .min(0, "Quantity must be positive")
    .int("Quantity must be an integer")
    .positive("Quantity must be positive"),
  inStock: z.boolean(),
});
type ProductFormData = z.infer<typeof productSchema>;

export default function AddProduct() {
  const {
    control,
    handleSubmit,
    register,
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

  const [addProduct, { isLoading }] = useAddProductMutation();

  const onSubmit = async (data: ProductFormData) => {
    const toastId = toast.loading("Adding product...");
    console.log(data);
    try {
      const productData={
        name:data.name,
        photo:data.photo,
        brand:data.brand,
        price:Number(data.price),
        category:data.category,
        description:data.description,
        quantity:Number(data.quantity),
        inStock:Boolean(data.inStock),
      }
      const result = await addProduct(productData).unwrap();
      console.log(result);
      if (result.success as boolean) {
        toast.success(result.message || "Product added successfully!", {
          id: toastId,
        });
      }
      else {
        toast.error(result.data.message || "Failed to add product", {
          id: toastId,
        });
      }
    } catch (error) {
      const apiError = error as TErrorResponse;
      console.log(error);
      toast.error(apiError.message||"Failed to add product", { id: toastId });
    }
  };

  return (
    <div className="container mx-auto">
      <Box
        component={"form"}
        sx={{
          "& > :not(style)": { m: 1, width: "100%" },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          paddingTop: 5,
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row justify-between">
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <Inventory sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              label="Product Name"
              variant="standard"
              sx={{ width: "100%" }}
              required
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
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
              type="url"
              sx={{ width: "100%" }}
              required
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <BrandingWatermark
              sx={{ color: "action.active", mr: 1, my: 0.5 }}
            />
            <TextField
              {...register("brand")}
              error={!!errors.brand}
              helperText={errors.brand?.message}
              label="Brand"
              variant="standard"
              type="text"
              sx={{ width: "100%" }}
              required
            />
          </Box>
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <Sell sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              label="Price"
              variant="standard"
              type="number"
              {...register("price", { valueAsNumber: true })}
              error={!!errors.price}
              helperText={errors.price?.message}
              sx={{ width: "100%" }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">Taka</InputAdornment>
                  ),
                },
              }}
              required
            />
          </Box>
          {/* Category */}
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <Category sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <Controller
              name="category"
              control={control}
              defaultValue="Writing"
              render={({ field:{onChange,value,...restField} }) => (
                <Autocomplete
                  options={catagories}
                  sx={{ width: "100%" }}
                  value={value || "Writing"}
                  onChange={(_, data) => onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      variant="standard"
                      sx={{ width: "100%" }}
                      error={!!errors.category}
                      helperText={errors.category?.message}
                      required
                    />
                  )}
                  {...restField}
                />
              )}
            />
          </Box>
        </div>
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <TextField
            id="standard-multiline-static"
            label="Description"
            multiline
            rows={4}
            variant="standard"
            sx={{ width: "100%" }}
            {...register("description")}
          />
        </Box>
        <div className="flex flex-col md:flex-row justify-between">
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <ProductionQuantityLimits
              sx={{ color: "action.active", mr: 1, my: 0.5 }}
            />
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

          {/* In Stock */}
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
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                )}
              />
            </Box>
          </Box>
        </div>
        <Button
          type="submit"
          variant="outlined"
          sx={{ mt: 3, width: "100%", maxWidth: "30ch" }}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Product"}
        </Button>
      </Box>
    </div>
  );
}
