import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  IconButton,
  TextField,
  Typography,
  Stack,
  FormHelperText,
  Button,
  SelectChangeEvent,
  Container,
  Paper,
} from "@mui/material";
import React, { ReactNode } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Customer } from "../../components/Tables/CustomerColumns";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { InvoiceType } from "../../components/Tables/InvoiceColumns";
import InvoiceFormLoader from "../../components/Loaders/InvoiceFormLoader";
import { toast } from "react-toastify";
import { fetcher } from "../../services/api/api";
import {
  apiCustomersUrl,
  apiInvoicesUrl,
  invoicesPath,
} from "../../utils/config";
import { CRUD } from "../../services/api/crud";
import { setFormErrors } from "../../utils/form/setFormErrors";

const invoiceStatus = ["PAID", "CANCELLED", "SENT"];

const statusFrench: { [name: string]: string } = {
  PAID: "Paid",
  SENT: "Sent",
  CANCELLED: "Cancelled",
  PENDING: "Pending",
};

const statusIconColor: {
  [name: string]: "success" | "warning" | "error" | "secondary";
} = {
  PAID: "success",
  SENT: "warning",
  CANCELLED: "error",
  PENDING: "secondary",
};

const statusIcon: { [name: string]: ReactNode } = {
  PAID: <CheckCircleIcon sx={{ mr: 2 }} />,
  SENT: <SendIcon sx={{ mr: 2 }} />,
  CANCELLED: <CancelIcon sx={{ mr: 2 }} />,
  PENDING: <PauseCircleOutlineIcon sx={{ mr: 2 }} />,
};

export const Invoice = () => {
  let { invoiceId } = useParams();
  // console.log("invoiceId", invoiceId);
  const [editing, setEditing] = React.useState<boolean | undefined>(
    invoiceId !== "new"
  );
  // console.log("editing", editing);

  const invoiceSchema = yup.object({
    amount: yup
      .number()
      .min(0, "The minimum amount must be zero")
      .required("The invoice amount is required"),
    status: yup
      .string()
      .oneOf(
        invoiceStatus,
        "Possible invoice status values are: PAID | SENT | CANCELLED"
      )
      .required("The invoice status is required"),
    customerId: yup.string().required("The invoice must be have a customer"),
  });

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      status: invoiceStatus[0],
      customerId: "",
      amount: 0,
    },
    resolver: yupResolver(invoiceSchema),
  });

  //   navigation hook from react router dom for redirect to Invoices lists when the Invoice creation is successful
  const navigate = useNavigate();

  React.useEffect(() => {
    // console.log("on useEffect editing = ", editing);

    // Set the initial value of select customer to the first element in the customers list if not undifined
    // customers && setValue("customer", customers[0]["@id"]!);

    // console.log("getValues('firsName') = ", getValues("firsName"));
    // data && initFormInputValues(data);
    if (invoiceId !== "new") {
      setEditing(invoiceId !== "new");
    }

    return () => {
      // Clear the eventual form fields error message before the component is unmounted.
      clearErrors(["amount", "status", "customerId"]);
    };
  }, [invoiceId]);

  const url = `${apiInvoicesUrl}/${invoiceId}`;
  // Async function to GET invoice by id passed in parameter
  const fetchInvoice = async () => {
    return await fetcher<"GET", InvoiceType>({ url }, { method: "GET" }); //invoicesAPI.findById(+invoiceId!);
  };

  const initFormInputValues = (invoice: any) => {
    console.log(invoice);
    console.log(getValues());
    // Setting default values of all fields in the form with invoice data above return by the server
    Object.keys(getValues()).forEach((field: any) => {
      setValue(field, invoice[field]);
      /*if (field === "customerId") {
        setValue(field, invoice["customerId"]);
      } else {
        setValue(field, invoice[field]);
      }*/
    });
  };

  //   Initialize react Query to GET Invoice
  const queryKey = [editing ? "invoice." + invoiceId : "invoice"];
  const {
    data,
    status,
    isLoading,
    isFetchedAfterMount,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: queryKey,
    queryFn: fetchInvoice,
    enabled: editing,
    // retry: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    refetchInterval: 120000,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    onSuccess: (data_: any) => {
      // Setting default values of all fields in the form with customer data above return by the server
      initFormInputValues(data_);
    },
    onError: (data_: any) => {
      toast.error(
        "An unexpected error occured when trying to get the data. 😭"
      );
    },
  });

  const queryClient = useQueryClient();

  // ========= React Query Mutation Initialize for updating invoice using optimist approch =========
  const { mutateAsync, isLoading: isUpdateInvoiceLoading } = useMutation({
    mutationFn: async (invoice: InvoiceType) => {
      return await CRUD.update(invoice, url);
    }, //invoicesAPI.update,
    onMutate: (updateInvoice: InvoiceType) => {
      // console.log("============== START onMutate ==============");
      // console.log("Invoice Id = " + id);
      const previousInvoice = queryClient.getQueryData<InvoiceType | undefined>(
        queryKey
      );

      const invoice_ = queryClient.setQueryData<InvoiceType>(
        queryKey,
        (invoice) => {
          // console.log("setQueryData onMutate", invoices?.length);
          return updateInvoice;
        }
      );

      const invoice = queryClient.getQueryData<InvoiceType[] | []>(queryKey);

      console.log(invoice, invoice_);
      // console.log("============== END onMutate ==============");

      return { previousInvoice };
    },
  });

  // ========= Launch React Query Mutation for updating Invoice =========
  const updateInvoice = async (updateInvoice: InvoiceType) => {
    const invoice = { ...updateInvoice };
    await mutateAsync(invoice, {
      onError: (err: any, _, context) => {
        console.log("onError Update Invoice Mutation", typeof err);
        console.log(err);
        if (context?.previousInvoice) {
          queryClient.setQueryData(queryKey, context.previousInvoice);
          // initFormInputValues(context.previousInvoice);
        }
        err.type = "update";
        setFormErrors(err.errors, setError);

        toast.error("The invoice's modification failed. 😭");
      },
      onSuccess: (data, variables, context) => {
        toast.success("Successfully updated the invoice. 😃");
        // console.log(data, variables);
      },
    });
    // queryClient.invalidateQueries({ queryKey: queryKey });
  };

  // Initialize the react Query service to get all customers from server or cache and pass them to the select form option
  const customersQueryKey = ["customers"];
  const cachedCustomers =
    queryClient.getQueryData<Customer[]>(customersQueryKey);
  // console.log("cachedCustomers", cachedCustomers);
  const {
    data: dataCustomers,
    // status: statusCustomers,
    isLoading: isLoadingCustomers,
  } = useQuery<any, Error, Customer[], string[]>({
    queryKey: customersQueryKey,
    queryFn: async () => {
      const inpt = { url: apiCustomersUrl };
      return await fetcher<"GET", Customer>(inpt, { method: "GET" });
    }, //customersAPI.findAll,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: cachedCustomers ? false : true,
    onSuccess: (customers: Customer[]) => {
      if (!editing) {
        console.log("onSuccess customers", customers);
        setValue("customerId", customers[0]["uid"]! as string);
      }
    },
    onError: () => {
      toast.error(
        "An unexpected occurred when trying to get the customer's list 😭."
      );
    },
  });

  const onSubmit = async (data_: any) => {
    // console.log("======= onSubmit Invoice data =======");
    console.log(data_);
    const invoice = {
      ...data_,
    };
    // delete invoice.customer;
    // console.log(invoice);
    clearErrors(["status", "customerId", "amount"]);
    let resp: any;

    // if editing invoice
    if (editing) {
      // console.log("editing Invoice");
      try {
        resp = await updateInvoice(invoice);
      } catch (error) {}
      // resp && console.log("Error :", resp);
    } else {
      // if creating invoice
      // console.log("creating Invoice");

      try {
        resp = await CRUD.create(invoice, apiInvoicesUrl);
        // console.log(resp);

        toast.success("Invoice successfully created. 😃");

        // Redirect to invoices list home page
        navigate(invoicesPath);
      } catch (error: any) {
        // Form Fields errors management
        error.type = "create";
        setFormErrors(error, setError);
        // console.log(error);
      }
    }
  };

  const customers = dataCustomers || cachedCustomers;
  // console.log(customers);
  React.useEffect(() => {
    
    if (!editing && cachedCustomers) {
      // console.log("cached customers", cachedCustomers);
      setValue("customerId", cachedCustomers[0]["uid"]! as string);
    }
  
    return () => {
      
    }
  }, [])
  
  // customers && console.log("customer iri = ", customers![0]["@id"]);
  const loading = editing ? (status === "loading" ? true : false) : isLoadingCustomers;
  // console.log("editing", editing);
  // console.log("status", status);
  // console.log("loading", loading);
  return (
    <Container>
      <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={4}>
        <Box className="p-[1.5rem]">
          <Typography variant={"h3"} component={"h1"}>
            {editing ? "Modification of the invoice" : "Adding a new invoice"}
          </Typography>

          {
            // <Typography variant={"h3"} component={"h1"}>
            //   Loading...
            // </Typography>

            loading ? (
              <InvoiceFormLoader />
            ) : (
              <Box
                component={"form"}
                sx={{
                  "& .MuiFormControl-root": { my: 2 },
                  "& .MuiButton-root": {
                    textTransform: "none",
                    borderRadius: 10,
                  },
                }}
                noValidate
                autoComplete={"off"}
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* Amount Number Field */}
                <Controller
                  control={control}
                  name={"amount"}
                  defaultValue={0}
                  render={({ field, formState }) => (
                    <TextField
                      variant={"outlined"}
                      {...field}
                      label={"Amount"}
                      type={"number"}
                      fullWidth
                      error={formState.errors.amount && true}
                      helperText={
                        formState.errors.amount
                          ? (formState.errors.amount.message as string)
                          : "* Required Field"
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                        className: "dark:text-zinc-200",
                        inputProps: { min: 0, step: 100 },
                      }}
                    />
                  )}
                />

                {/* Inline Group of Status and Customer Select Field */}

                {/* Status Select Field */}
                <Controller
                  control={control}
                  name={"status"}
                  render={({ field, formState: { errors } }) => (
                    <FormControl fullWidth error={errors.status && true}>
                      <InputLabel id={"invoice-status"}>
                        Invoice's status
                      </InputLabel>
                      <Select
                        {...field}
                        error={errors.status && true}
                        labelId={"invoice-status"}
                        label={"Invoice's status *"}
                        sx={{ textTransform: "none" }}
                        renderValue={(value) => {
                          return customRenderInvoiceStatus(value);
                        }}
                      >
                        {invoiceStatus.map((status) => {
                          return (
                            <MenuItem
                              key={status + "_" + uuid()}
                              value={status}
                            >
                              {statusFrench[status]}
                              {/* {customRenderInvoiceStatus(status)} */}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      <FormHelperText>
                        {errors.status
                          ? (errors.status.message as string)
                          : "* Required Field"}
                      </FormHelperText>
                    </FormControl>
                  )}
                />

                {/* Customer Select Field */}
                <Controller
                  control={control}
                  name={"customerId"}
                  render={({ field, formState: { errors } }) => (
                    <FormControl
                      // {...field}
                      fullWidth
                      error={errors.customerId && true}
                    >
                      <InputLabel id={"invoice-customer"}>Customer</InputLabel>
                      <Select
                        {...field}
                        // value={field.value}
                        // onChange={(e) => field.onChange(e.target.value)}
                        defaultValue={
                          customers?.length! > 0
                            ? (customers![0]["uid"] as string)
                            : ""
                        }
                        labelId={"invoice-customer"}
                        label={"Customer"}
                      >
                        {customers &&
                          customers.map((customer: Customer) => {
                            return (
                              <MenuItem key={uuid()} value={customer["uid"]}>
                                {customer.firstName} {customer.lastName}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      <FormHelperText>
                        {errors.customerId
                          ? (errors.customerId.message as string)
                          : "* Required Field"}
                      </FormHelperText>
                    </FormControl>
                  )}
                />

                {/* Inline Group Button */}
                <Stack
                  direction={"row"}
                  spacing={2}
                  justifyContent={"flex-end"}
                  // sx={{ "& .MuiButton-root": {} }}
                >
                  <LoadingButton
                    loading={isSubmitting || isUpdateInvoiceLoading}
                    variant={"contained"}
                    size={"large"}
                    color={"success"}
                    type={"submit"}
                  >
                    Save
                  </LoadingButton>
                  {(!isSubmitting || !isUpdateInvoiceLoading) && (
                    <Link to={invoicesPath}>
                      <Button variant={"text"} size={"large"}>
                        Back to list
                      </Button>
                    </Link>
                  )}
                </Stack>
              </Box>
            )
          }
        </Box>
      </Paper>
    </Container>
  );
};

const customRenderInvoiceStatus = (value: any): ReactNode => {
  return (
    <IconButton
      sx={{
        mr: 4,
        fontSize: 18,
        textTransform: "none",
        "& .MuiIconButton-root:hover": { backgroundColor: "pink" },
      }}
      color={statusIconColor[value]}
    >
      {statusIcon[value]} {statusFrench[value]}
    </IconButton>
  );
};
