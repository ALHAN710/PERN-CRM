import { Box, Paper, Skeleton, Stack } from "@mui/material";
import React from "react";
import ContentLoader from "react-content-loader";

const CustomerFormLoader = (props: any) => {
  // <ContentLoader
  //   speed={2}
  //   width={500}
  //   height={560}
  //   viewBox="0 0 500 560"
  //   backgroundColor="#f3f3f3"
  //   foregroundColor="#ecebeb"
  //   {...props}
  // >
  //   <rect x="9" y="23" rx="0" ry="0" width="366" height="36" />
  //   <rect x="197" y="247" rx="11" ry="11" width="75" height="30" />
  //   <rect x="289" y="245" rx="11" ry="11" width="75" height="30" />
  //   <rect x="9" y="78" rx="0" ry="0" width="366" height="39" />
  //   <rect x="8" y="135" rx="0" ry="0" width="366" height="36" />
  //   <rect x="9" y="185" rx="0" ry="0" width="366" height="36" />
  // </ContentLoader>
  const height = 40;
  const animation: "pulse" | "wave" | boolean = "pulse";
  return (
    <>
      <Skeleton variant="text" animation={animation} height={100} />
      {Array.from({ length: 4 }).map((item, index) => (
        <Skeleton
        key={`skeleton-${index}`}
          variant={"rectangular"}
          animation={animation}
          // width={"95%"}
          height={height}
          sx={{ mb: 2 }}
        />
      ))}
      <Stack
        direction={"row"}
        spacing={2}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <Skeleton
          variant={"rounded"}
          animation={animation}
          width={"20%"}
          height={height}
        />
        <Skeleton
          variant={"rounded"}
          animation={animation}
          width={"20%"}
          height={height}
        />
      </Stack>
    </>
  );
};

export default CustomerFormLoader;
