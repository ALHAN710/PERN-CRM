import React from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import { PasswordField } from "../components/Forms/PasswordField";
// import userAPI from "../../services/api/userAPI";
import { apiUsersSignUpUrl, apiUsersUrl, loginPath } from "../utils/config";
import { setFormErrors } from "../utils/form/setFormErrors";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { CRUD } from "../services/api/crud";
import { TUser } from "../types/models/user";

export default function Register() {
  const navigate = useNavigate();

  const userSchema = yup.object({
    firstName: yup
      .string()
      .min(3, "The first name must be at least 3 caracters !")
      .required("The first name is required !"),
    lastName: yup
      .string()
      .min(3, "The last name must be at least 3 caracters !")
      .required("The last name is required !"),
    email: yup
      .string()
      .email("Invalid format address email !")
      .required("The email is required !"),
    password: yup
      .string()
      .min(8, "The password must be at least 8 characters")
      .required("The password is required !"),
    confirmPassword: yup
      .string()
      .test(
        "password-match",
        "The confirmation password don't match with the password",
        function (value) {
          return this.parent.password === value;
        }
      ),
    roles: yup.array().of(yup.string()),
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: "Test",
      lastName: "Demo",
      email: "test@crm.com",
      password: "password",
      confirmPassword: "password",
      roles: ["USER"],
    },
    resolver: yupResolver(userSchema),
  });

  const registerMutation = useMutation({
    mutationFn: async (user: TUser) => {
      console.log(apiUsersSignUpUrl);
      await CRUD.create(user, apiUsersSignUpUrl, true);
    },//usersAPI.create,
    // onMutate: (user: TUser) => {},
    onSuccess: (_, user, context) => {
      console.log("============= onSuccess =============");
      // display a toast success message
      toast.success(
        "User successfully registered 🤗. You can now login to your account !"
      );  

      // Redirect to the login page after successful registration
      navigate(loginPath);
    },
    onError: (err: any, user, _) => {
      console.log("============= onError =============");
      console.log(err.errors);
      // display a toast error message
      toast.error("Fail to register the user.");

      // Form Fields errors management
      setFormErrors(err.errors, setError);
    },
  });

  const onSubmit = async (user_: TUser) => {
    const user = { ...user_ };

    // Remove confirmPassword to object before submitting
    delete user.confirmPassword;
    console.log(user);

    try {
      await registerMutation.mutateAsync({ ...user });
    } catch (error) {
      // console.log(error);
    }

    /*try {
      await usersAPI.create(user);
      // display a toast success message
      toast.success("User successfully registered.");

      // Redirect to the login page after successful registration
      navigate(loginPath);
    } catch (error: any) {
      // display a toast error message
      toast.error("Fail to register the user.");

      // Form Fields errors management
      error.type = "create";
      setFormErrors(error, setError);
      //   console.log(error);
    }*/
  };

  return (
    
    <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={4}>
      <Box className="p-[1.5rem]">
        <Typography variant={"h2"} component={"h1"}>
          Register to the App !
        </Typography>

        <Box
          component={"form"}
          sx={{
            "& .MuiFormControl-root": { my: 2 },
            "& .MuiButton-root": {
              textTransform: "none",
              borderRadius: 10,
            },
          }}
          noValidate
          autoComplete={"off"}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* First Name Text Field */}
          <Controller
            name={"firstName"}
            control={control}
            render={({ field, formState: { errors } }) => (
              <TextField
                {...field}
                label={"First name"}
                fullWidth
                error={errors.firstName && true}
                helperText={
                  errors.firstName
                    ? (errors.firstName.message as string)
                    : "* Required Field"
                }
              />
            )}
          />

          {/* Last Name Text Field */}
          <Controller
            name={"lastName"}
            control={control}
            render={({ field, formState: { errors } }) => (
              <TextField
                {...field}
                label={"Last Name"}
                fullWidth
                error={errors.lastName && true}
                helperText={
                  errors.lastName
                    ? (errors.lastName.message as string)
                    : "* Required Field"
                }
              />
            )}
          />

          {/* Email Field */}
          <Controller
            name={"email"}
            control={control}
            render={({ field, formState: { errors } }) => (
              <TextField
                {...field}
                label={"Email Address"}
                type={"email"}
                fullWidth
                error={errors.email && true}
                helperText={
                  errors.email
                    ? (errors.email.message as string)
                    : "* Required Field"
                }
              />
            )}
          />

          {/* Password Field */}
          <Controller
            name={"password"}
            control={control}
            render={({ field, formState }) => (
              <PasswordField
                field={field}
                formState={formState}
                label={"Password"}
              />
            )}
          />

          {/* Confirm Password Field */}
          <Controller
            name={"confirmPassword"}
            control={control}
            render={({ field, formState }) => (
              <PasswordField
                field={field}
                formState={formState}
                label={"Confirm Password"}
              />
            )}
          />

          <Stack
            direction={"row"}
            spacing={2}
            justifyContent={"flex-end"}
            alignItems={"center"}
            sx={{
              "& .MuiButton-root": { borderRadius: 10 },
              textTransform: "none",
            }}
          >
            <LoadingButton
              variant={"contained"}
              size={"large"}
              color={"success"}
              type={"submit"}
              loading={isSubmitting}
            >
              Sign Up !
            </LoadingButton>
            <Link to={loginPath}>
              <Button size={"large"}>Already have an account?</Button>
            </Link>
          </Stack>
        </Box>
      </Box>
    </Paper>
    
  );
}
