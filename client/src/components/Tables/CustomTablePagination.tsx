import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TablePaginationActions from "./TablePaginationActions";

type TProps = {
  totalItems: any;
  count: any;
  page: any;
  onPageChange: any;
  onRowsPerPageChange: any;
  rowsPerPage: any;
  rowsPerPageOptions: any;
};
export const CustomTablePagination = ({
  totalItems,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  rowsPerPageOptions,
}: TProps) => {
  // const { children } = props;
  // const { _owner } = children;
  // const { memoizedProps } = _owner;
  // const {
  //   totalItems,
  //   count,
  //   page,
  //   onPageChange,
  //   onRowsPerPageChange,
  //   rowsPerPage,
  //   rowsPerPageOptions,
  // } = memoizedProps;
  // console.log("on Custom Table Pagination");
  // console.log(props);
  // console.log(children);
  // console.log("total Items : ", totalItems);

  const from = (page + 1) * rowsPerPage - rowsPerPage + 1;
  const to = from + rowsPerPage - 1;

  const handleRowsPerPageChange = (event: SelectChangeEvent) => {
    onRowsPerPageChange(event);
  };

  return (
    <Stack
      direction={"row"}
      spacing={2}
      alignItems="center"
      sx={{ my: 2, mr: 2 }}
      className="dark:text-zinc-400"
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
      >
        <div className="flex items-center">
          <span>Row per page :</span>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={rowsPerPage}
              size="small"
              // label="Age"
              autoWidth
              className="dark:text-zinc-200"
              onChange={handleRowsPerPageChange}
            >
              {rowsPerPageOptions.map(
                (option: number | { label: string; value: number }) => {
                  const val =
                    typeof option === "number" ? option : option.value;
                  return (
                    <MenuItem
                      key={`row-${val}`}
                      className="dark:text-zinc-400"
                      value={val}
                    >
                      {typeof option === "number" ? option : option.label}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>
          <span>
            {from}-{to} of {totalItems}
          </span>
        </div>
        {rowsPerPage < totalItems && (
          <TablePaginationActions
            {...{ count, page, rowsPerPage, onPageChange }}
          />
        )}
      </Stack>
    </Stack>
  );
};
