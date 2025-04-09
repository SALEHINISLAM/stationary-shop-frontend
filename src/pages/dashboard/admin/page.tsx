import { Button } from "@mui/material";
import { useAppDispatch } from "../../../redux/hooks";
import { logOut } from "../../../redux/features/auth/authSlice";
import AdminNavbar from "./components/adminNavbar";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    // Logic for logging out the user
    await dispatch(logOut());
    console.log("User logged out");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between container mx-auto">
      <AdminNavbar />
      <Button variant="contained" type="submit" onClick={handleLogout} color="error">Logout</Button>
      </div>
      <Outlet/>
    </div>
  );
}
