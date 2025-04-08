import { Button } from "@mui/material";
import { useAppDispatch } from "../../../redux/hooks";
import { logOut } from "../../../redux/features/auth/authSlice";

export default function AdminDashboard() {
  const dispatch=useAppDispatch()
  const handleLogout =async () => {
    // Logic for logging out the user
    await dispatch(logOut())
    console.log("User logged out");
  };
  return (
    <div>admin
      <Button variant="contained" type="submit" onClick={handleLogout}>Logout</Button>
    </div>
  )
}
