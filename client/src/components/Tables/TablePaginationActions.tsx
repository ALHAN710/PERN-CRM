import React from "react";

import Box from "@mui/material/Box";
// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import IconButton from "@mui/material/IconButton";
// import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";
import Pagination from "@mui/material/Pagination";

const TablePaginationActions = (props: any) => {
  const { count, page, rowsPerPage, onPageChange } = props;
  // console.log(props);
  const nbPages = Math.max(0, Math.ceil(count / rowsPerPage) );
  const currentPage = page + 1 > nbPages ? page - 1 : page + 1;
  // console.log("nbPages", nbPages);
  // console.log("Page", page);
  // console.log("Current page", currentPage);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(event, value - 1);
  };

  /*const handleFirstPageButtonClick = (event: any) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };*/

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <Pagination
        count={nbPages}
        page={page+1}
        // defaultPage={1}
        color="primary"
        onChange={handleChange}
        showFirstButton
        showLastButton
      />
      {/* <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton> */}
    </Box>
  );
};

export default TablePaginationActions;
