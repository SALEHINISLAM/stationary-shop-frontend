import {
  Add,
  DeleteForever,
  Inventory,
  ManageAccounts,
  Menu,
  People,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { JSX, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const [activePath, setActivePath] = useState("/dashboard/admin/all-products")
  const location=useLocation()
  useEffect(()=>{
    setActivePath(location.pathname)
  },[location])
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const adminNavItems: { name: string; path: string; icon: JSX.Element }[] = [
    {
      name: "Add Product",
      path: "/dashboard/admin/add-product",
      icon: <Add />,
    },
    {
      name: "Delete Product",
      path: "/dashboard/admin/delete-product",
      icon: <DeleteForever />,
    },
    {
      name: "All Products",
      path: "/dashboard/admin/all-products",
      icon: <Inventory />,
    },
    {
      name: "Manage Users",
      path: "/dashboard/admin/manage-users",
      icon: <People />,
    },
    {
      name: "Manage Orders",
      path: "/dashboard/admin/manage-orders",
      icon: <ManageAccounts />,
    },
  ];

  const drawerList = (
    <Box sx={{ width: 250,paddingTop:5 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {adminNavItems.map((item, index) => (
          <ListItem key={index} disablePadding className={`${activePath===item.path?"bg-blue-200":""}`}>
            <Link to={item.path} className="flex flex-row p-1.5 hover:bg-gray-200 w-full">
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name}></ListItemText>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Button onClick={toggleDrawer(true)} sx={{ padding: 0,margin: 0, minWidth:'auto',display:'flex', justifyContent:"center" }}>
        <ListItem disablePadding sx={{display:'flex',padding:0,margin:0}}>
          <ListItemIcon sx={{display:'flex',padding:0,margin:0,justifyContent:"center",minWidth:"unset"}}>
            <Menu />
          </ListItemIcon>
        </ListItem>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </>
  );
}
