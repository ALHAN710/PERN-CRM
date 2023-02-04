import React from "react";
import Stack from "@mui/material/Stack";
import { Container } from "@mui/system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequireAuth from "./components/RequireAuth";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { ContextAPI, ContextProvider, TContextAPI } from "./context/ContextAPI";
import { CustomerPage } from "./pages/Customers/Customer";
import Customers from "./pages/Customers/Customers";
import Home from "./pages/Home";
import { Invoice } from "./pages/Invoices/Invoice";
import Invoices from "./pages/Invoices/Invoices";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import * as config from "./utils/config";
// import theme from "./utils/theme";
import getCustomTheme from "./utils/theme";
import { Box } from "@mui/material";
import { Footer } from "./components/Footer";

const queryClient = new QueryClient();

function App() {
  const { theme: mode_ } = React.useContext(ContextAPI) as TContextAPI;
  console.log("App Mode = ", mode_);
  const mode = React.useMemo(() => mode_, [mode_]);

  const theme = getCustomTheme(mode);
  // console.table(config);
  React.useEffect(() => {
    // (document.querySelector("body") as HTMLElement).classList.add("") ;

    return () => {};
  }, [mode]);

  return (
    // React query client provider
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {/* Auth Context API */}
        {/* <ContextProvider> */}
        <Router basename={import.meta.env.BASE_URL}>
          <ResponsiveAppBar />
          <Container className="  mt-24 mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path={config.loginPath} element={<Login />} />
              <Route path={config.usersRegisterPath} element={<Register />} />
              <Route
                path={config.customersPath}
                element={
                  <RequireAuth>
                    <Customers />
                  </RequireAuth>
                }
              />
              <Route
                path={`${config.customersPath}/:customerId`}
                element={
                  <RequireAuth>
                    <CustomerPage />
                  </RequireAuth>
                }
              />
              <Route
                path={`${config.invoicesPath}/:invoiceId`}
                element={
                  <RequireAuth>
                    <Invoice />
                  </RequireAuth>
                }
              />
              <Route
                path={config.invoicesPath}
                element={
                  <RequireAuth>
                    <Invoices />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
          <Footer />
        </Router>
        <ToastContainer
          position={toast.POSITION.BOTTOM_LEFT}
          theme={mode !== "dark" ? "colored" : mode}
        />
        {/* </ContextProvider> */}
      </ThemeProvider>
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

export default App;
