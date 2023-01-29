import { Paper, Skeleton } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import ContentLoader from "react-content-loader";
import { v4 as uuid } from "uuid";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const CustomersTableLoader = (props: any) => {
  const { width: maxWidth, height: maxHeight } = useWindowDimensions();
  const cHeight = React.useMemo(() => 30, [maxWidth, maxHeight]);
  const xSpacing = React.useMemo(() => 20, [maxWidth]);
  const ySpacing = React.useMemo(() => 20, [maxHeight]);

  const columns = React.useMemo(
    () => [
      {
        name: "ID",
        width: 98, //maxWidth / 9.77551, //
        height: cHeight,
      },
      {
        name: "Client",
        width: 273, // maxWidth / 3.509158, //
        height: cHeight,
      },
      {
        name: "Email",
        width: 387, // maxWidth / 2.475452, //
        height: cHeight,
      },
      {
        name: "Entreprise",
        width: 321, // maxWidth / 2.984424, //
        height: cHeight,
      },
      {
        name: "Facture",
        width: 155, // maxWidth / 6.180645, //
        height: cHeight,
      },
      {
        name: "Montant",
        width: 187, // maxWidth / 5.122995, //
        height: cHeight,
      },
      {
        name: "Editer",
        width: 74, //maxWidth / 12.945946, //
        height: cHeight,
      },
      {
        name: "Supprimer",
        width: 104, // maxWidth / 9.211538, //
        height: cHeight,
      },
    ],
    [maxWidth, maxHeight]
  );

  //   const maxWidth = 1744;
  //   const maxHeight = 560;
  const y0 = React.useMemo(() => 56 + 50, [maxWidth, maxHeight]);
  //   console.log("maxWidth/1744", maxWidth / 1744);
  //   console.log("maxHeight/560", maxHeight / 560);
  //   console.log("maxHeight/cHeight", maxHeight / 30);
  //   console.log("maxWidth/xSpacing", maxWidth / 20);
  //   console.log("maxHeight/ySpacing", maxHeight / 20);
  //   console.log("maxWidth/ID", maxWidth / 98);
  //   console.log("maxWidth/Client", maxWidth / 273);
  //   console.log("maxWidth/Email", maxWidth / 387);
  //   console.log("maxWidth/Entreprise", maxWidth / 321);
  //   console.log("maxWidth/Facture", maxWidth / 155);
  //   console.log("maxWidth/Montant", maxWidth / 187);
  //   console.log("maxWidth/Editer", maxWidth / 74);
  //   console.log("maxWidth/Supprimer", maxWidth / 104);
  //   console.log("maxHeight/57", maxHeight / 57);
  //   console.log("maxWidth/1007", maxWidth / 1007);
  const height = 30;
  const animation: "pulse" | "wave" | boolean = "pulse";
  return (
    // <ContentLoader
    //   speed={1}
    //   width={maxWidth / 1.1009}
    //   height={maxHeight / 1.039}
    //   viewBox={`0 0 ${maxWidth / 1.1009} ${maxHeight / 1.039}`}
    //   backgroundColor="#f3f3f3"
    //   foregroundColor="#ecebeb"
    //   {...props}
    // >
    //   <rect
    //     x="0"
    //     y="23"
    //     rx="0"
    //     ry="0"
    //     width={`1774`}
    //     height={`57`}
    //     // width={`${maxWidth / 0.95134}`}
    //     // height={`${maxHeight / 10.10526}`}
    //   />
    //   {Array.from({ length: 8 }).map((value, row) => {
    //     // console.log("row = ", row, value);
    //     let w = 0;
    //     let y = row > 0 ? (row - 1) * (cHeight + xSpacing) + y0 : y0;
    //     return columns.map((item, index) => {
    //       //   console.log({ ...item }, index);
    //       let x = w;
    //       w += item.width + xSpacing;
    //       return (
    //         <rect
    //           key={uuid()}
    //           x={`${x}`}
    //           y={`${y}`}
    //           rx="0"
    //           ry="0"
    //           width={`${item.width}`}
    //           height={`${cHeight}`}
    //         />
    //       );
    //     });
    //   })}

    //   {/* <rect x="9" y="77" rx="0" ry="0" width="23" height={`57`} />   // ID w=98 h=57
    // <rect x="45" y="77" rx="0" ry="0" width="91" height={`57`} />  // Client w=273 h=57
    // <rect x="145" y="77" rx="0" ry="0" width="81" height={`57`} /> // Email w=387 h=57
    // <rect x="236" y="77" rx="0" ry="0" width="81" height={`57`} /> // Entreprise w=321 h=57
    // <rect x="327" y="77" rx="0" ry="0" width="81" height={`57`} /> // Facture w=155 h=57
    // <rect x="419" y="77" rx="0" ry="0" width="81" height={`57`} /> // Montant w=187 h=57
    //                                                              // w=323 h=57

    // <rect x="9" y="108" rx="0" ry="0" width="24" height={`57`} />   // ID
    // <rect x="44" y="108" rx="0" ry="0" width="92" height={`57`} />  // Client
    // <rect x="145" y="108" rx="0" ry="0" width="81" height={`57`} /> // Email
    // <rect x="236" y="108" rx="0" ry="0" width="81" height={`57`} /> // Entreprise
    // <rect x="327" y="108" rx="0" ry="0" width="81" height={`57`} /> // Facture
    // <rect x="419" y="109" rx="0" ry="0" width="81" height={`57`} /> // Montant
    // <rect x="515" y="109" rx="0" ry="0" width="35" height={`57`} /> // Editer
    // <rect x="557" y="109" rx="0" ry="0" width="37" height={`57`} /> // Supprimer  */}

    //   {/* <rect x="9" y="138" rx="0" ry="0" width="24" height="18" />
    // <rect x="44" y="138" rx="0" ry="0" width="92" height="18" />
    // <rect x="145" y="138" rx="0" ry="0" width="81" height="18" />
    // <rect x="236" y="138" rx="0" ry="0" width="81" height="18" />
    // <rect x="327" y="138" rx="0" ry="0" width="81" height="18" />
    // <rect x="419" y="139" rx="0" ry="0" width="81" height="18" />
    // <rect x="515" y="139" rx="0" ry="0" width="35" height="18" />
    // <rect x="557" y="139" rx="0" ry="0" width="37" height="18" />
    // <rect x="10" y="168" rx="0" ry="0" width="24" height="18" />
    // <rect x="45" y="168" rx="0" ry="0" width="92" height="18" />
    // <rect x="146" y="168" rx="0" ry="0" width="81" height="18" />
    // <rect x="237" y="168" rx="0" ry="0" width="81" height="18" />
    // <rect x="328" y="168" rx="0" ry="0" width="81" height="18" />
    // <rect x="420" y="169" rx="0" ry="0" width="81" height="18" />
    // <rect x="516" y="169" rx="0" ry="0" width="35" height="18" />
    // <rect x="558" y="169" rx="0" ry="0" width="37" height="18" />
    // <rect x="10" y="196" rx="0" ry="0" width="24" height="18" />
    // <rect x="45" y="196" rx="0" ry="0" width="92" height="18" />
    // <rect x="146" y="196" rx="0" ry="0" width="81" height="18" />
    // <rect x="237" y="196" rx="0" ry="0" width="81" height="18" />
    // <rect x="328" y="196" rx="0" ry="0" width="81" height="18" />
    // <rect x="420" y="197" rx="0" ry="0" width="81" height="18" />
    // <rect x="516" y="197" rx="0" ry="0" width="35" height="18" />
    // <rect x="558" y="197" rx="0" ry="0" width="37" height="18" /> */}
    // </ContentLoader>
    <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={4}>
      <Box className="p-[1rem]">
        <Skeleton
          variant={"rounded"}
          animation={animation}
          width={"99%"}
          height={54}
          className="mb-7"
        />

        <Box className="w-full min-w-[650px]">
          <Stack direction={"row"} spacing={2} className="mb-2">
            <Skeleton
              variant={"rectangular"}
              animation={animation}
              width={"5%"}
              height={height}
            />
            <Skeleton
              variant={"rectangular"}
              animation={animation}
              width={"12%"}
              height={height}
            />
            <Skeleton
              variant={"rectangular"}
              animation={animation}
              width={"24%"}
              height={height}
            />
            <Skeleton
              variant={"rectangular"}
              animation={animation}
              width={"14%"}
              height={height}
            />
            <Skeleton
              variant={"rectangular"}
              animation={animation}
              width={"9%"}
              height={height}
            />
            <Skeleton
              variant={"rectangular"}
              animation={animation}
              width={"8%"}
              height={height}
            />
          </Stack>
          {Array.from({ length: 10 }).map((item, index) => (
            <Stack key={`row-${index}`} direction={"row"} spacing={2} className="mb-2">
              <Skeleton
                variant={"rectangular"}
                animation={animation}
                width={"5%"}
                height={height}
              />
              <Skeleton
                variant={"rectangular"}
                animation={animation}
                width={"12%"}
                height={height}
              />
              <Skeleton
                variant={"rectangular"}
                animation={animation}
                width={"24%"}
                height={height}
              />
              <Skeleton
                variant={"rectangular"}
                animation={animation}
                width={"14%"}
                height={height}
              />
              <Skeleton
                variant={"rectangular"}
                animation={animation}
                width={"9%"}
                height={height}
              />
              <Skeleton
                variant={"rectangular"}
                animation={animation}
                width={"8%"}
                height={height}
              />
              <Skeleton
                variant={"rounded"}
                animation={animation}
                width={"7%"}
                height={height}
              />
              <Skeleton
                variant={"rounded"}
                animation={animation}
                width={"7%"}
                height={height}
              />
            </Stack>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default CustomersTableLoader;
