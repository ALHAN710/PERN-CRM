import React from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// import { authAPI } from "../../services/api/authAPI";
import { LoadingButton } from "@mui/lab";

import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TCredentials } from "../types/userType";
import { firebaseSignIn } from "../services/auth/firebase-auth";
import { useMutation } from "@tanstack/react-query";
import * as config from "../utils/config";
import { Alert, AlertTitle, Collapse, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AlertNotification from "../components/AlertNotification";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const loginSchema = yup
    .object({
      email: yup
        .string()
        .required(
          "Email address is required, please enter it !"
        )
        .email(),
      password: yup
        .string()
        .required(
          "Password is required, please enter it !"
        )
        .min(8, "The password must be contains at least 8 characters !"),
    })
    .required();

  // Initialize React hook form to manage the login form
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TCredentials>({
    defaultValues: {
      email: "demo@pern-crm.com",
      password: "password"
    },
    resolver: yupResolver(loginSchema),
  });

  // console.log(isSubmitting);

  // React router dom navigate hook for changing the url location
  const navigate = useNavigate();

  // Using to get the origin url location if it exists to redirect after login successfull
  const location = useLocation();

  // Handle the click event on the show password icon to toggle the local state showPassword
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => event.preventDefault();

  const loginMutation = useMutation({
    mutationFn: firebaseSignIn,
    onSuccess: async (data, variables, _) => {
      

      const idToken = await data.currentUser?.user.getIdTokenResult();
      const token = idToken?.token;
      const { exp } = idToken?.claims!;

      // Store the token and expiration time in the local storage
      window.localStorage.setItem("authToken", token!);
      window.localStorage.setItem("authExp", exp!);

      // Display a toast success connexion message
      toast.success(data.toastMessage);

      //Redirect to the origin or customer page
      const origin = location.state?.from?.pathname || config.customersPath;
      const url = origin !== config.loginPath ? origin : config.customersPath;
      navigate(url);

    },
    onError: (error: any, variables, context) => {
      // console.log("========= onError ==========");
      // const err = JSON.parse(error);
      // console.log(err);

      // Switch On the alert notification
      setOpen(true);

      // Set the alert notification message
      setMessage(error.alertMessage);

      // Display a toast error connexion message
      toast.error(error.toastMessage);

      // return Promise.reject(error);

    },
  });

  // Gestion du submit
  /*const onSubmit = async (data: any) => {
    setOpen(false);

    console.log(data);
    const result = await firebaseSignIn(data);
    // { stsTokenManager: {accessToken: string, expirationTime}}
    console.log("======== Sign In result ========");
    console.log(result);
    if (!result.currentUser) {
      setOpen(true);
      setMessage(result.alertMessage);

      // Display a toast error connexion message
      toast.error(result.toastMessage);
    } else {
      const idToken = await result.currentUser.user.getIdTokenResult();
      const token = idToken.token;
      const { exp } = idToken.claims;

      // Store the token and expiration time in the local storage
      window.localStorage.setItem("authToken", token);
      window.localStorage.setItem("authExp", exp!);

      // Display a toast success connexion message
      toast.success(result.toastMessage);

      //Redirect to customer page
      const origin = location.state?.from?.pathname || "/customers";
      navigate(origin);
    }
    // console.log(err);
  };*/

  const onSubmit = React.useCallback(async (data: TCredentials) => {
    setOpen(false);
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {}
  }, []);

  /*const onSubmit = React.useCallback(async (data: any) => {
    setOpen(false);
    
    // console.log(data);
    const result = await firebaseSignIn(data);
    // { stsTokenManager: {accessToken: string, expirationTime}}
    // console.log("======== Sign In result ========");
    // console.log(result);
    if (!result.currentUser) {
      setOpen(true);
      setMessage(result.alertMessage);

      // Display a toast error connexion message
      toast.error(result.toastMessage);
    } else {
      const idToken = await result.currentUser.user.getIdTokenResult();
      const token = idToken.token;
      const { exp } = idToken.claims;

      // Store the token and expiration time in the local storage
      window.localStorage.setItem("authToken", token);
      window.localStorage.setItem("authExp", exp!);

      // Display a toast success connexion message
      toast.success(result.toastMessage);

      //Redirect to customer page
      const origin = location.state?.from?.pathname || "/customers";
      navigate(origin);
    }
    // console.log(err);
  }, []);*/

  return (
    // <Container sx={{ my: 2 }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box className="p-[1.4rem]">
          <Typography variant={"h3"} component={"h1"}>
            Connect to the App !
          </Typography>

          {/* Alert Notification for error message */}
          <AlertNotification open={open} setOpen={setOpen} message={message} />
          {/* <Box sx={{ width: "100%" }}>
            <Collapse in={open}>
              <Alert
                severity={"error"}
                action={
                  <IconButton
                    aria-label={"close"}
                    color={"inherit"}
                    size={"large"}
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize={"inherit"} />
                  </IconButton>
                }
                sx={{ my: 2 }}
              >
                <AlertTitle>Error</AlertTitle>
                <strong>{message}</strong>
              </Alert>
            </Collapse>
          </Box> */}

          <Box
            component={"form"}
            sx={{
              "& .MuiTextField-root": { my: 1, color: "primary" },
              "& .MuiTextLabel-root": { color: "primary" },
              "& .MuiButton-root": { textTransform: "none" },
              my: 4,
            }}
            noValidate
            autoComplete={"off"}
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email Field */}
            <Controller
              control={control}
              name={"email"}
              defaultValue={"demo1@nodejs.com"}
              render={({ field, formState }) => (
                <TextField
                  variant={"outlined"}
                  {...field}
                  inputRef={field.ref}
                  placeholder={"demo1@nodejs.com"}
                  label={"Email Address"}
                  type={"email"}
                  required
                  fullWidth
                  error={formState.errors.email && true}
                  helperText={
                    formState.errors.email
                      ? (formState.errors.email.message as string)
                      : "* Required Field"
                  }
                />
              )}
            />

            {/* Password Field */}
            <Controller
              control={control}
              name={"password"}
              defaultValue={"password"}
              render={({ field, formState }) => (
                <TextField
                  variant={"outlined"}
                  {...field}
                  placeholder={"password"}
                  label={"Password"}
                  required
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  inputRef={field.ref}
                  error={formState.errors.password && true}
                  helperText={
                    formState.errors.password
                      ? (formState.errors.password.message as string)
                      : "* Required Field"
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position={"end"}>
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge={"end"}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Stack
              direction={"row"}
              justifyContent={"flex-end"}
              sx={{ my: 2, mr: 0 }}
            >
              <LoadingButton
                loading={isSubmitting}
                size={"large"}
                color={"success"}
                type={"submit"}
                variant={"contained"}
              >
                I Log In !
              </LoadingButton>
            </Stack>
          </Box>

        </Box>
      </Paper>

    // {/* </Container> */}
  );
};

export default Login;
