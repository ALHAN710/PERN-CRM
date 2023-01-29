import React from "react";
import { Box } from "@mui/material";
const NotFound: React.FC<{}> = () => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center",
      fontSize: 24,
      color: "red",
    }}
    >
      <p>Oups! Page Not Found</p>
    </Box>
  );
};

export default NotFound;
