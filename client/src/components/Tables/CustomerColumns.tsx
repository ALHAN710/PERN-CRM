import { Badge } from "@mui/material";
import { CellContext, createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { LoadingButton } from "@mui/lab";
import { customersPath } from "../../utils/config";

export type Customer = {
  "@id"?: string;
  uid?: string;
  id?: number | string;
  firstName?: string;
  lastName?: string;
  //fullName?: string;
  email?: string;
  company?: string;
  invoices?: string[];
  nbInvoices?: number;
  user?: string;
  totalAmount?: number;
  unpaidAmount?: number;
};

/*

export const CUSTOMER_COLUMNS = [
  {
    accessorKey: "id",
    id: "Id",
    header: "Id",
    footer: (props: HeaderContext<Customer, string | undefined>) =>
      props.column.id,
  },
  {
    accessorKey: "fullName",
    id: "Client",
    header: "Client",
    footer: (props: HeaderContext<Customer, string | undefined>) =>
      props.column.id,
  },
  {
    accessorKey: "email",
    header: "Email",
    footer: "Email",
  },
  {
    accessorKey: "company",
    header: "Entreprise",
    footer: "Entreprise",
  },
  {
    accessorKey: "invoices",
    header: "Factures",
    footer: "Factures",
    cell: (info: CellContext<Customer, string[] | undefined>) =>
      info.getValue()?.length,
  },
  {
    accessorKey: "age",
    header: "Age",
    footer: "Age",
  },
  {
    acccessorKey: "totalAmount",
    header: "Montant",
    footer: "Montant",
  },
  {
    accessorKey: "",
    id: "Action",
    header: "",
    footer: "",
    cell: (info: CellContext<Customer, string[] | undefined>) => (
      <button
        className="btn btn-sm btn-danger"
        onClick={() => handleDelete(info.row.original.id!)}
      >
        Supprimer
      </button>
    ),
  },
];
*/

export function getCustomerColumns(
  isDeleteLoading: boolean,
  btnId: number | string,
  fn: Function
) {
  return [
    {
      accessorKey: "id",
      id: "Id",
      header: "#Id",
    },
    {
      //accessorKey: "fullName",
      accessorFn: (row: any) => `${row.firstName} ${row.lastName}`,
      id: "Client",
      header: "Customer Name",
      cell: (info: CellContext<Customer, string[] | undefined>) => (
        <Link
          to={`${customersPath}/${info.row.original.uid}`}
          style={{ textDecoration: "none" }}
        >
          {`${
            info.row.original.firstName
          } ${info.row.original.lastName?.toUpperCase()}`}
        </Link>
      ),
      // footer: (props: HeaderContext<Customer, string | undefined>) =>
      //   props.column.id,
    },
    {
      accessorKey: "email",
      header: "Email",
      footer: "Email",
    },
    {
      accessorKey: "company",
      header: "Company",
      footer: "Company",
    },
    {
      accessorKey: "invoices",
      header: "Invoices",
      // footer: "Factures",
      accessorFn: (props: any) => {
        // console.log(props.invoices.length);
        return props.invoices;
      },
      cell: (info: CellContext<Customer, string[] | undefined>) => {
        // console.log(info.getValue(), info.getValue()?.length);
        return (
          // <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
          //   <Badge
          //     badgeContent={info.getValue()?.length}
          //     color="warning"
          //     overlap="rectangular"
          //     showZero={true}
          //     className={"rounded-full bg-purple-500"}
          //   />
          // </Stack>
          <div className="flex justify-center items-center">
            <span className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-purple-100 bg-purple-600 rounded-full">
              {info.getValue()?.length}
            </span>
          </div>
        );
        // <span className="badge badge-warning">{info.getValue()?.length}</span>
      },
    },
    {
      acccessorKey: "totalAmount",
      id: "Amount",
      header: "Amount",
      // footer: "Montant",
      accessorFn: (props: any) => props.totalAmount,
      cell: (info: CellContext<Customer, string | undefined>) => {
        // console.log(info);
        return `${info.getValue()?.toLocaleString()} $`; // €
      },
    },
    {
      accessorKey: "",
      id: "Action",
      header: "",
      footer: "",
      cell: (info: CellContext<Customer, string[] | undefined>) => {
        // console.log("isDeleteLoading", isDeleteLoading);
        /*if (isDeleteLoading === true) {
          console.log("isDeleteLoading", isDeleteLoading);
          if (btnId === info.row.original.uid)
            console.log(btnId, info.row.original.uid);
        }
        isDeleteLoading === true
          ? btnId === info.row.original.uid!
            ? console.log(btnId, info.row.original.uid, isDeleteLoading)
            : null
          : null;*/

          // TODO: Add tooltip message to disabled loading button
          /*<Tooltip title="Add" arrow>
            <Button>Arrow</Button>
          </Tooltip>*/
        return (
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={1}
            sx={{ "& .MuiButton-root": { textTransform: "capitalize" } }}
            // style={{ textTransform: "capitalize" }}
          >
            <Link to={`${customersPath}/${info.row.original.uid}`}>
              <Button variant="contained" size="small">
                Edit
              </Button>
            </Link>
            <LoadingButton
              variant="contained"
              color="error"
              size="small"
              disabled={info.row.original.invoices?.length! > 0 ? true : false}
              loading={
                isDeleteLoading && btnId === info.row.original.uid!
                  ? true
                  : false
              }
              onClick={() => fn(info.row.original.uid!)}
              className="text-zinc-300"
            >
              Delete
            </LoadingButton>
          </Stack>
        );

        // <button
        //   className="btn btn-sm btn-danger"
        //   disabled={
        //     (info.row.original.invoices?.length! > 0 ||
        //       (isDeleteLoading && btnId === info.row.original.uid)) &&
        //     true
        //   }
        //   onClick={() => fn(info.row.original.uid!)}
        // >
        //   <>
        //     {btnId === info.row.original.uid &&
        //       console.log(btnId, info.row.original.uid)}
        //     {isDeleteLoading && btnId === info.row.original.uid ? (
        //       <span
        //         className="spinner-border spinner-border-sm"
        //         role="status"
        //       ></span>
        //     ) : (
        //       "Supprimer"
        //     )}
        //   </>
        // </button>
      },
    },
  ];
}
