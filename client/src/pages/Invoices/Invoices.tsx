import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
// import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";
import { Button, IconButton, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import {
  getInvoiceColumns,
  InvoiceType,
} from "../../components/Tables/InvoiceColumns";
import MuiPaginationTable from "../../components/Tables/MuiPaginationTable";
import InvoicesTableLoader from "../../components/Loaders/InvoicesTableLoader";
import { toast } from "react-toastify";
import { fetcher } from "../../services/api/api";
import { apiInvoicesUrl } from "../../utils/config";
import { CRUD } from "../../services/api/crud";
import { AddCircle } from "@mui/icons-material";

export default function Invoices() {
  const [btnUid, setBtnUid] = React.useState<number | string>("0");

  const invoicesQueryKey = ["invoices"];
  const { status, data, isRefetching } = useQuery<
    any,
    Error,
    InvoiceType[],
    string[]
  >({
    queryKey: invoicesQueryKey,
    queryFn: async () => {
      return await fetcher<"GET", InvoiceType>(
        { url: apiInvoicesUrl },
        { method: "GET" }
      );
    }, //invoicesAPI.findAll,
    refetchOnWindowFocus: false,
    refetchInterval: 120000,
    onSuccess: (data) => {
      console.log(data);
      !isRefetching &&
        toast.success("Successfully getting the invoices' list. 😀");
    },
    onError: (error) => {
      //display an error get INVOICES toast message
      !isRefetching &&
        toast.error(
          "An unexpected error occurred while fetching the invoices' list. 😭"
        );

      // console.log("Error getting INVOICES");
      // console.log(error);
    },
  });

  const queryClient = useQueryClient();

  // ========= React Query Mutation Initialize for remove invoice using optimist approch =========
  const { mutateAsync, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async (uid: number | string) => {
      return await CRUD.delete(`${apiInvoicesUrl}/${uid}`);
    }, //invoicesAPI.remove,
    onMutate: (uid: number | string) => {
      // console.log("============== START onMutate ==============");
      // console.log("Invoice Id = " + id);
      const previousInvoices = queryClient.getQueryData<InvoiceType[] | []>([
        "invoices",
      ]);

      const invoices = queryClient.setQueryData<InvoiceType[]>(
        invoicesQueryKey,
        (invoices) => {
          // console.log("setQueryData onMutate", invoices?.length);
          return invoices && invoices.filter((invoice) => invoice.uid !== uid);
        }
      );

      // const invoices_ = queryClient.getQueryData<InvoiceType[] | []>([
      //   "invoices",
      // ]);

      // console.log("invoices_", invoices_);

      return { previousInvoices };
    },
    onError: (err, _, context) => {
      // console.log("onError Remove INVOICE Mutation");
      context?.previousInvoices &&
        queryClient.setQueryData(invoicesQueryKey, context.previousInvoices);

      // Display a Toast remove invoice error message
      toast.error("Failed to remove the invoice. 😭");
    },
    onSuccess: (data, variables, _) => {
      // Display a Toast remove invoice success message
      toast.success("Successfully removing the invoice ! 😃");

      // console.log("Remove INVOICE mutation successfull");
      // console.log(data, variables);
    },
  });

  // Handle the click event on delete button of each invoice
  const handleBtnDeleteInvoice = async (uid: number | string) => {
    // console.log("invoice", uid);
    setBtnUid(uid);

    // ========= Launch React Query Mutation for remove invoice =========
    await mutateAsync(uid);
  };

  // Getting invoice columns definition for React Table initialisation
  const columns = React.useMemo(
    () => getInvoiceColumns(handleBtnDeleteInvoice),
    []
  );

  // Setting the invoices fetching status message
  let content =
    status === "loading" ? (
      <InvoicesTableLoader /> // <h2>Loading...</h2>
    ) : status === "error" ? (
      // <h2>Error: {error.message}</h2>
      <h2>Oops, Sorry we can't get the list of customers for now 😭...</h2>
    ) : null;

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        
      >
        <h1>
          List of invoices
        </h1>

        <Link to="/invoices/new">
          <Button
            sx={{
              textTransform: "capitalize",
            }}
            size={"large"}
            variant={"outlined"}
          >
            Add an invoice
          </Button>

        </Link>
      </Stack>
      {/* <ColumnGroupingTable /> */}
      {content !== null ? (
        content
      ) : data !== undefined ? (
        <MuiPaginationTable {...{ data, columns }} />
      ) : (
        ""
      )}
    </>
  );
}
