import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
  Paper,
  Avatar,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useLoginMutation } from '../../redux/features/auth/authApi';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { TErrorResponse } from '../../types/errorTypes';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/features/auth/authSlice';
import { jwtDecode } from "jwt-decode";

type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: LoginFormData) => {
    const toastId = toast.loading("Logging in...");
    
    try {
      const res=await login(data).unwrap();
      console.log(res);
      if (res.success) {
        const token = res.data.accessToken;
        const decodeUser=jwtDecode(token)
        console.log(decodeUser);
        dispatch(setUser({token, user:decodeUser}))
        //save to redux
        toast.success(res.message||"Logged in successfully!", { 
          id: toastId,
          icon: <ThumbUpIcon />,
          duration: 1000,
        });
        await navigate('/dashboard');
      }
      else {
        toast.error(res.message||"Login Failed", { id: toastId });
      }
    } catch (err) {
      const apiError = err as TErrorResponse;
      const errMessage = apiError.message || "Login failed, please try again";
      
      toast.error(errMessage, {
        id: toastId,
        duration: 5000,
        action: {
          label: 'Retry',
          onClick: () => window.location.reload()
        }
      });
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Link href="/forgot-password" variant="body2" underline="hover">
                Forgot password?
              </Link>
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
              <Link href="/register" variant="body2" underline="hover">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
