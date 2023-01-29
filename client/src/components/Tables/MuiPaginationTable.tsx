import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Customer } from "./CustomerColumns";

import {
  Column, flexRender, getCoreRowModel, getFacetedMinMaxValues, getFacetedRowModel,
  getFacetedUniqueValues, getFilteredRowModel,
  getPaginationRowModel, Table as ReactTable,
  useReactTable
} from "@tanstack/react-table";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import React from "react";
import { CustomTablePagination } from "./CustomTablePagination";
import { InvoiceType } from "./InvoiceColumns";
import { fuzzyFilter } from "./ReactTable_Utils/fuzzyFilterSort";
import TablePaginationActions from "./TablePaginationActions";
import { TableFooter } from "@mui/material";

export default function MuiTablePagination({
  data,
  columns,
}: {
  data: Customer[] | InvoiceType[];
  columns: any;
}) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      //columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    //
    // debugTable: true,
  });

  const { pageSize, pageIndex } = table.getState().pagination;
  // console.log("Total", data.length);
  // console.log("Page size", pageSize);
  // console.log("Page Index", pageIndex);
  // console.log(table.getRowModel().rows);
  // console.log("table.getFilteredRowModel().rows.length", table.getFilteredRowModel().rows.length);

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={4}>
        <Box className="p-[1rem]">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="font-lg shadow border border-block mb-7 text-lg"
            placeholder="Search all columns..."
          />
          <TableContainer sx={{ maxHeight: 650 }}>
            <Table
              stickyHeader
              sx={{ minWidth: 650 }}
              aria-label="Customers table"
            >
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableCell
                          key={header.id}
                          align={
                            [
                              "#Id",
                              "Invoices",
                              "Amount",
                              "Number",
                              "Status",
                            ].includes(String(header.column.columnDef.header))
                              ? "center"
                              : "inherit"
                          }
                          colSpan={header.colSpan}
                        >
                          {
                            header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )
                            // (
                            //   <div>
                            //     {flexRender(
                            //       header.column.columnDef.header,
                            //       header.getContext()
                            //     )}
                            //     {header.column.getCanFilter() ? (
                            //       <div>
                            //         <Filter column={header.column} table={table} />
                            //       </div>
                            //     ) : null}
                            //   </div>
                            // )
                          }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => {
                  // console.log(
                  //   "Row Cell Montant value",
                  //   row.getValue(row.id + "_Montant")
                  // );
                  return (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        // console.log(
                        //   cell.column.columnDef.cell,
                        //   typeof cell.getContext().getValue()
                        // );
                        // console.log(
                        //   flexRender(cell.column.columnDef.cell, cell.getContext())
                        // );
                        return (
                          <TableCell
                            key={cell.id}
                            align={
                              typeof cell.getContext().getValue() === "number"
                                ? "center"
                                : "inherit"
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction={"row"} spacing={2} justifyContent="flex-end">
            <TablePagination
              rowsPerPageOptions={[
                5,
                10,
                25,
                50,
                100,
                { label: "All", value: data.length },
              ]}
              // totalItems={data.length}
              component={() => <CustomTablePagination totalItems={data.length} 
              count={table.getFilteredRowModel().rows.length}
              page={pageIndex}
              onPageChange={(_: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
                table.setPageIndex(page);
              }}
              onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const size = e.target.value ? Number(e.target.value) : 5;
                table.setPageSize(size);
              }}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[
                5,
                10,
                25,
                50,
                100,
                { label: "All", value: data.length },
              ]}
              />}
              // component={"div"}
              count={table.getFilteredRowModel().rows.length}
              rowsPerPage={pageSize}
              page={pageIndex}
              SelectProps={{
                inputProps: { "aria-label": "rows per page" },
                native: true,
              }}
              onPageChange={(_, page) => {
                table.setPageIndex(page);
              }}
              onRowsPerPageChange={(e) => {
                const size = e.target.value ? Number(e.target.value) : 5;
                table.setPageSize(size);
              }}
              ActionsComponent={TablePaginationActions}
            />
          </Stack>

        </Box>
      </Paper>
    </>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: ReactTable<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <InputBase
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <InputBase
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
        inputProps={{ "aria-label": "search" }}
      />
    </div>
  ) : (
    <InputBase
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
      inputProps={{ "aria-label": "search" }}
    />
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 100,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    
    return () => clearTimeout(timeout);
  }, [value]);
  
  // console.log("on Debounced Input");
  return (
    <TextField
      {...props}
      variant={"outlined"}
      color={"primary"}
      size={"medium"}
      fullWidth
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
