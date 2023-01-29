import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";

export const PasswordField = (props: any) => {
  const [showPassword, setShowPassword] = React.useState<Boolean>(false);

  const {
    formState: { errors },
    field,
    label,
  } = props;

  // Handle the click on the show password icon to toggle the local state showPassword
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      variant="outlined"
      {...field}
      // name="password"
      //   placeholder="password"
      // classes={{label: "dark:text-red-500"}}
      // sx={{fieldset: {borderColor: "pink"}}}
      label={label}
      fullWidth
      type={showPassword ? "text" : "password"}
      error={errors[field.name] && true}
      helperText={
        errors[field.name]
          ? (errors[field.name].message as string)
          : "* Required Field"
      }
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" >
            <IconButton
            className="dark:text-zinc-500"
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
