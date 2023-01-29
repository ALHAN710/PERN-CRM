import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { Customer } from "../../components/Tables/CustomerColumns";
import CustomerFormLoader from "../../components/Loaders/CustomerFormLoader";
import { toast } from "react-toastify";
import { apiCustomersUrl, customersPath } from "../../utils/config";
import { fetcher } from "../../services/api/api";
import { CRUD } from "../../services/api/crud";
import { setFormErrors } from "../../utils/form/setFormErrors";

export const CustomerPage = () => {
  let { customerId } = useParams();
  const [editing, setEditing] = React.useState(customerId !== "new");
  //   console.log(editing);
  // The infinite re-rendering occurs when this line is uncommented, why ???
  //   if (customerId !== "new") setEditing(true);

  // YUP schema for the form constraint validation
  const customerSchema = yup.object({
    firstName: yup
      .string()
      .required(
        "First name is required, please fill it in !"
      )
      .min(3, `The First name must be at least 3 characters long !`)
      .max(255, `The First name must be at most 3 characters long !`),
    lastName: yup
      .string()
      .required(
        "Last name is required, please fill it in !"
      )
      .min(3, `The last name must be at least 3 characters long !`)
      .max(255, `The last name must be at most 3 characters long !`),
    email: yup
      .string()
      .email("The format of address email entered is not valid !")
      .required(
        "Address email is required, please fill it in !"
      ),
    company: yup
      .string()
      .max(255, "Not more than 255 characters for this field")
      .notRequired(),
  });

  // Initialize the react hook form to manage the customer creationg/updating form data
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
      firstName: "",
      lastName: "",
      email: "",
      company: "",
    },
    resolver: yupResolver(customerSchema),
  });

  //   navigation hook from react router dom for redirect to customers lists when the customer creation is successful
  const navigate = useNavigate();

  const url = `${apiCustomersUrl}/${customerId}`;
  const fetchCustomer = async () => {
    return await fetcher<"GET", Customer>(
      { url },
      {
        method: "GET",
      }
    );
    // return await customersAPI.findById(+customerId!);
  };

  type TCustomerFormField = "firstName" | "lastName" | "email" | "company";
  const initFormInputValues = (customer: any) => {
    // Setting default values of all fields in the form with customer data above return by the server
    Object.keys(getValues()).forEach((field) => {
      //   console.log(getValues(field));
      setValue(field as TCustomerFormField, customer[field]);
    });
  };

  //   Initialize react Query to GET and UPDATE customer
  const queryKey = [editing ? "customer." + customerId : "customer"];
  const { data, status, isLoading, isFetchedAfterMount, isRefetching } =
    useQuery({
      queryKey: queryKey,
      queryFn: fetchCustomer,
      enabled: editing,
      // retry: false,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      refetchInterval: 120000,
      refetchIntervalInBackground: true,
      refetchOnMount: false,
      onSuccess: (data_: any) => {
        // Setting default values of all fields in the form with customer data above return by the server
        initFormInputValues(data_);
        // console.log("onSuccess query");
      },
      onError: (data_: any) => {
        toast.error(
          "An unexpected occurred when trying to get the customer's list 😭."
        );
      },
    });

  const queryClient = useQueryClient();

  // ========= React Query Mutation Initialize for updating customer using optimist approch =========
  const { mutateAsync, isLoading: isUpdateLoading } = useMutation({
    mutationFn: async (customer: Customer) => {
      return await CRUD.update(customer, url);
    }, //customersAPI.update,
    onMutate: (updateCustomer: Customer) => {
      // console.log("============== START onMutate ==============");
      // console.log("Customer Id = " + id);
      const previousCustomer = queryClient.getQueryData<Customer | undefined>(
        queryKey
      );

      const customer_ = queryClient.setQueryData<Customer>(
        queryKey,
        (customer) => {
          // console.log("setQueryData onMutate", customers?.length);
          return updateCustomer;
        }
      );

      // const customer = queryClient.getQueryData<Customer[] | []>(queryKey);

      // console.log(customer, customer_);
      // console.log("============== END onMutate ==============");

      return { previousCustomer };
    },
  });

  // ========= Launch React Query Mutation for updating customer =========
  const updateCustomer = async (updateCustomer: Customer) => {
    // const customer = { ...updateCustomer, id: +customerId! };
    const customer = { ...updateCustomer };
    await mutateAsync(customer, {
      onError: (err: any, _, context) => {
        // console.log("onError Update Customer Mutation", typeof err);
        console.log(err);
        if (context?.previousCustomer) {
          queryClient.setQueryData(queryKey, context.previousCustomer);
          // initFormInputValues(context.previousCustomer);
        }
        // err.type = "update";
        setFormErrors(err.errors, setError);
        toast.error(
          "An unexpected error occurred when trying to update the customer"
        );
      },
      onSuccess: (data, variables, context) => {
        toast.success("Modification successfully done ! 😃");
        // console.log(data, variables);
      },
    });
    // queryClient.invalidateQueries({ queryKey: queryKey });
  };

  React.useEffect(() => {
    if (customerId !== "new") {
      // Update the local state editing
      setEditing(customerId !== "new");
    }

    return () => {
      clearErrors(["firstName", "lastName", "email"]);
    };
  }, [customerId, status]);

  // Gestion du submit
  const onSubmit = async (_data: any) => {
    // console.log("======= onSubmit Customer data =======");
    const customer = {..._data};
    delete customer.id;
    console.log(customer);
    clearErrors(["firstName", "lastName", "email"]);
    let resp: any;
    // if editing customer
    if (editing) {
      try {
        resp = await updateCustomer(customer);
      } catch (error) {}
      // resp && console.log("Error :", resp);
    } else {
      // if creating customer
      try {
        resp = await CRUD.create(customer, apiCustomersUrl);
        // resp = await fetcher<"POST", Customer>(
        //   { url: apiCustomersUrl },
        //   {
        //     method: "POST",
        //     body: JSON.stringify(customer),
        //   }
        // ); //customersAPI.create(_data);
        // console.log(resp);

        toast.success("Customer created successfully 😃");

        // Redirect to customers list page
        navigate(customersPath);
      } catch (error: any) {
        // Form Fields errors management
        error.type = "create";
        console.log("======= Error =========");
        console.log(error);
        setFormErrors(error.errors, setError);

        toast.error("An unexpected occurred when trying to add the customer.");
      }
    }
    // console.log(err);
  };

  return (
    <Container>
      <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={4}>
        <Box className="p-[1.5rem]">
       
        {!editing ? (
          <Typography variant={"h3"} component={"h1"} sx={{ my: 2 }}>
            Create a Customer
          </Typography>
        ) : !isFetchedAfterMount && status !== "success" ? (
          <Typography variant={"h3"} component={"h1"} sx={{ my: 2 }}>
            {status === "loading" ? (
              <CustomerFormLoader /> //"Loading..." // 
            ) : (
              "Oops, an unexpected error occurs when trying to retrieve the customer's list..."
            )}
          </Typography>
        ) : (
          <>
            <Typography variant={"h2"} component={"h1"} sx={{ my: 2 }}>
              {`${`Modification of customer : ${data ? data["firstName"] : ""} ${
                data ? data["lastName"] : ""
              }`}`}
            </Typography>
          </>
        )}

        <Box
          component={"form"}
          sx={{
            "& .MuiTextField-root": { my: 1 },
            "& .MuiButton-root": { textTransform: "none" },
            display: `${editing && status === "loading" ? "none" : ""}`,
          }}
          noValidate
          autoComplete={"off"}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* FirstName Text Field */}
          <Controller
            control={control}
            name={"firstName"}
            defaultValue={""}
            render={({ field, formState }) => (
              <TextField
                variant={"outlined"}
                // name="username"
                {...field}
                //   inputRef={field.ref}
                placeholder={"Please enter the customer's first name..."}
                label={"Customer's First Name"}
                type={"text"}
                // required
                fullWidth
                error={formState.errors.firstName && true}
                helperText={
                  formState.errors.firstName
                    ? (formState.errors.firstName.message as string)
                    : "* Required Field"
                }
              />
            )}
          />

          {/* LastName Text Field */}
          <Controller
            control={control}
            name={"lastName"}
            defaultValue={""}
            render={({ field, formState }) => (
              <TextField
                variant={"outlined"}
                {...field}
                inputRef={field.ref}
                placeholder={"Please enter the customer's name..."}
                label={"Customer's Last Name"}
                type={"text"}
                // required
                fullWidth
                error={formState.errors.lastName && true}
                helperText={
                  formState.errors.lastName
                    ? (formState.errors.lastName.message as string)
                    : "* Required Field"
                }
              />
            )}
          />

          {/* Email Field */}
          <Controller
            control={control}
            name={"email"}
            defaultValue={""}
            render={({ field, formState }) => (
              <TextField
                variant={"outlined"}
                {...field}
                inputRef={field.ref}
                placeholder={"Please enter the customer's address email..."}
                label={"Customer's address email"}
                type={"email"}
                // required
                fullWidth
                error={formState.errors.email && true}
                helperText={
                  formState.errors.email
                    ? (formState.errors.email.message as string)
                    : "* Required Field"
                }
              />
            )}
          />

          {/* Company Text Field */}
          <Controller
            control={control}
            name={"company"}
            defaultValue={""}
            render={({ field, formState }) => (
              <TextField
                variant={"outlined"}
                // name="username"
                {...field}
                inputRef={field.ref}
                placeholder={"Please enter the customer's company name..."}
                label={"Company Name"}
                type={"text"}
                fullWidth
                error={formState.errors.company && true}
                helperText={(formState.errors.company?.message as string) || ""}
              />
            )}
          />

          {/* row's Buttons */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ my: 2 }}
            alignItems={"center"}
          >
            {/* Submit button with loading animation */}
            <LoadingButton
              loading={isSubmitting || isUpdateLoading}
              // loadingPosition="start"
              size={"large"}
              color={"success"}
              type={"submit"}
              // startIcon={<SaveIcon />}
              variant={"contained"}
              sx={{ mr: 2 }}
            >
              {editing ? "Update" : "Save"}
            </LoadingButton>

            {/* Back to Customers Home page Link Button - Display if editing is false */}
              <Link to={customersPath}>
                <Button size={"large"} variant={"text"}>
                  Back to list
                </Button>
              </Link>
            {/* {!editing && (
            )} */}
          </Stack>
        </Box>

        </Box>

      </Paper>
    </Container>
  );
};
