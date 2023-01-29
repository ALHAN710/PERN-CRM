import React from 'react'
import { Box, Alert, AlertTitle, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AlertProps } from "@mui/material/Alert";


type TAlertProps = AlertProps & {
    open?: boolean;
    severity?: string;
    message: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
 const AlertNotification: React.FC<TAlertProps> = ({ open, severity, message, setOpen }) => {
  return (
    <Box sx={{ width: "100%" }}>
    <Collapse in={open || false}>
      <Alert
        severity={severity || "error"}
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
  </Box>
  )
}

export default AlertNotification;
