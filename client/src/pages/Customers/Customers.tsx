import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
// import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CustomersTableLoader from "../../components/Loaders/CustomersTableLoader";
import {
  Customer,
  getCustomerColumns,
} from "../../components/Tables/CustomerColumns";
import MuiPaginationTable from "../../components/Tables/MuiPaginationTable";
import { CRUD } from "../../services/api/crud";
import { apiCustomersUrl } from "../../utils/config";
import { fetcher } from "../../services/api/api";

export default function Customers() {
  const [btnUid, setBtnUid] = React.useState<number | string>("0");

  const customersQueryKey = ["customers"];
  const { status, data, isRefetching } = useQuery<
    any,
    Error,
    Customer[],
    string[]
  >({
    queryKey: customersQueryKey,
    queryFn: async () => {
      return await fetcher<"GET", Customer>(
        { url: apiCustomersUrl },
        {
          method: "GET",
        }
      );
    },
    refetchOnWindowFocus: false,
    refetchInterval: 120000,
    onSuccess: (data) => {
      console.log(data);
      !isRefetching &&
        toast.success("Successfully retrieving customers' list. 👌");
    },
    onError: (error) => {
      !isRefetching &&
        toast.error(
          "An unexpected error occurs when retrieving the customers. 😭"
        );
      // console.log("Error getting CUSTOMERS");
      // console.log(error);
    },
  });

  // console.log(data);

  const queryClient = useQueryClient();

  // ========= React Query Mutation Initialize for remove customer using optimist approch =========
  const { mutateAsync, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async (uid: number | string) => {
      return await CRUD.delete(`${apiCustomersUrl}/${uid}`);
    }, //customersAPI.remove,
    onMutate: (uid: number | string) => {
      console.log("============== START onMutate ==============");
      // console.log("Customer Id = " + uid);
      const previousCustomers = queryClient.getQueryData<Customer[] | []>([
        "customers",
      ]);

      const customers = queryClient.setQueryData<Customer[]>(
        customersQueryKey,
        (customers) => {
          // console.log("setQueryData onMutate", customers?.length);
          return customers
            ? customers.filter((customer) => customer.uid !== uid)
            : [];
        }
      );

      /*const customers_ = queryClient.getQueryData<Customer[] | []>([
        "customers",
      ]);*/

      // console.log(customers?.length, customers_?.length);
      // console.log("============== END onMutate ==============");

      return { previousCustomers };
    },
    onError: (err, _, context) => {
      // console.log("onError Remove INVOICE Mutation");
      context?.previousCustomers &&
        queryClient.setQueryData(customersQueryKey, context.previousCustomers);

      toast.error("Failed to remove the customer. 😭");
    },
    onSuccess: () => {
      toast.success("Successfully removing the customer ! 😃");
    },
  });

  // Handle the click event on delete button of each customer
  const handleBtnDeleteCustomer = async (uid: number | string) => {
    // console.log("customer", uid);
    setBtnUid(uid);

    // ========= Launch React Query Mutation for removing the customer with uid =========
    await mutateAsync(uid);
  };

  // Getting customer columns definition for React Table initialisation
  const columns = React.useMemo(
    () => getCustomerColumns(isDeleteLoading, btnUid, handleBtnDeleteCustomer),
    [btnUid, isDeleteLoading]
  );

  // Setting the customers fetching status message
  let content =
    status === "loading" ? (
      <CustomersTableLoader /> // <h2>Loading...</h2>
    ) : status === "error" ? (
      // <h2>Error: {error.message}</h2>
      <h2>Oops, Sorry we can't get the list of customers for now 😭...</h2>
    ) : null;

  return (
    <>
      <Stack
        direction="row"
        justifyContent={"space-between"}
        alignItems="center"
      >
        <h1>List of customers</h1>
        <Link to="/customers/new">
          <Button
            variant="outlined"
            size="small"
            sx={{
              textTransform: "capitalize",
            }}
          >
            Add a customer
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
