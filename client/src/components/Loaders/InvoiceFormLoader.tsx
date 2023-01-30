import { Box, Skeleton, Stack } from "@mui/material";

const InvoiceFormLoader = (props: any) => {
  
  const height = 45;
  const animation: ("pulse" | "wave" | false) = "wave";
  return (<Box className="mt-10">
    {/* Amount Number Field */}
    <Skeleton variant="rounded" animation={animation} width={"100%"} height={height} />

    {/* Inline Group of Status and Customer Select Field */}
    <Stack
      spacing={3}
      className="my-5"
    >
      {/* Status Select Field */}
      <Skeleton variant="rounded" animation={animation} width={"100%"} height={height} />

      {/* Customer Select Field */}
      <Skeleton variant="rounded" animation={animation} width={"100%"} height={height} />
    </Stack>

    {/* Inline Group Button */}
    <Stack
      direction={"row"}
      spacing={2}
      justifyContent={"flex-end"}
      
    >
      <Skeleton variant="rounded" animation={animation} width={"15%"} height={height} />
      <Skeleton variant="rounded" animation={animation} width={"15%"} height={height} />
      
    </Stack>
  </Box>)
};

export default InvoiceFormLoader;
