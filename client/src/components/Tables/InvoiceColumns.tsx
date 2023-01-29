import { Badge, Button, Stack } from "@mui/material";
import { CellContext } from "@tanstack/react-table";
import moment from "moment";
import { Link } from "react-router-dom";
import { invoicesPath } from "../../utils/config";

export type InvoiceType = {
  id?: number | string;
  uid?: number | string;
  amount?: number;
  sentAt?: string;
  status?: "CANCELLED" | "SENT" | "PAID";
  chrono?: number;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    company: string;
  };
};

export const STATUS_MSG: { [status_: string]: string } = {
  SENT: "Envoyé",
  PAID: "Payé",
  CANCELLED: "Annulé",
};

export const STATUS_COLOR: {
  [status_: string]: "warning" | "success" | "error";
} = {
  SENT: "warning",
  PAID: "success",
  CANCELLED: "error",
};

export function getInvoiceColumns(onDeleteBtn: Function) {
  return [
    {
      accessorKey: "chrono",
      id: "chrono",
      header: "Number",
    },
    {
      id: "Client",
      header: "Customer",
      accessorFn: (row: any) =>
        `${row.customer.firstName} ${row.customer.lastName.toUpperCase()}`,
    },
    {
      accessorKey: "sent_at",
      id: "Date d'envoi",
      header: "Sent At",
      cell: (info: CellContext<InvoiceType, string[] | undefined>) => {
        // console.log(info.getValue());
        return moment(info.getValue()).format("DD/MM/YYYY");
      },
    },
    {
      accessorKey: "status",
      id: "Statut",
      header: "Status",
      accessorFn: (row: any) => STATUS_MSG[row.status],
      cell: (info: CellContext<InvoiceType, string | undefined>) => {
        // console.log(info.cell.row.original);
        return (
          <Stack direction={"row"} justifyContent="center">
            <Badge
              // badgeContent={String(STATUS_MSG[info.getValue()!])}
              badgeContent={info.getValue()}
              color={STATUS_COLOR[info.cell.row.original.status!]}
              overlap="rectangular"
            />
          </Stack>
        );
      },
    },
    {
      accessorKey: "amount",
      id: "Montant",
      header: "Amount",
      cell: (info: CellContext<InvoiceType, string | undefined>) => {
        // console.log(info);
        return `${info.getValue()} $`;
      },
    },
    {
      accessorKey: "",
      id: "Action",
      header: "",
      footer: "",
      cell: (info: CellContext<InvoiceType, string[] | undefined>) => {
        // console.log("isDeleteLoading", isDeleteLoading);
        return (
          <Stack
            direction={"row"}
            spacing={1}
            alignItems={"center"}
            sx={{ "& .MuiButton-root": { textTransform: "capitalize" } }}
          >
            <Link to={`${invoicesPath}/${info.row.original.uid}`}>
              <Button variant="contained" size={"small"}>
                Edit
              </Button>
            </Link>

            <Button
              variant="contained"
              color="error"
              size="small"
              // disabled={info.row.original.invoices?.length! > 0 ? true : false}
              className="text-zinc-300"
              style={{ textTransform: "capitalize" }}
              onClick={() => onDeleteBtn(info.row.original.uid)}
            >
              Delete
            </Button>
          </Stack>
        );
      },
    },
  ];
}
