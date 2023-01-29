import { LoginRounded, LogoutRounded } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Divider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../images/logo192.png";
import { firebaseSignOut } from "../services/auth/firebase-auth";
import { checkIsAuthenticated } from "../services/auth/isAuthenticated";
import * as config from "../utils/config";
import SwitchDarkMode from "./SwitchDarkMode";

const pages = ["Customers", "Invoices"];
const pagesLink = [config.customersPath, config.invoicesPath];
const settings = ["Profile", "Logout"];
const auth = ["Register", "Log In", "Log Out"];

// let isAuthenticated = false;

// const checkUser = async () => {
//   isAuthenticated = await checkIsAuthenticated();
// };

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const isAuthenticated = checkIsAuthenticated();
  // React.lazy(() => checkIsAuthenticated());

  // checkUser();

  // React router dom navigate hook for changing the url location
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    // console.log(event.currentTarget);
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  //   console.log(anchorElNav);

  const handleLogout = async () => {
    // check if the user is not already logged out
    // const isAuthenticated = checkIsAuthenticated();

    if (isAuthenticated) {
      //Sign out user to firebase server
      const result = await firebaseSignOut();
      if (result) {
        // Remove the token and expiration time from the local storage
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("authExp");

        // Display a toast deconnexion success message
        toast.info("You're now disconnected 👋 !");

        //Redirect to login page
        navigate(config.loginPath);
      } else {
        // Display a toast deconnexion rror message
        toast.error("Sorry, Deconnexion failed 🤔 !");
      }
    } else {
      // Display a toast deconnexion success message
      toast.info("You're already disconnected 😁 !");
    }
  };

  const { pathname } = useLocation();
  const location = pathname.replace("/", "").toLowerCase();
  // console.log("pathname", pathname.replace("/", ""));

  return (
    <AppBar position="fixed" color="inherit" className="dark:bg-slate-800">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Home LOGO md view */}
          {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
          <Link
            to="/"
            style={{ textDecoration: "none" }}
            className="hidden md:flex mr-2"
            // sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          >
            <img
              src={Logo}
              alt="React logo"
              style={{ width: "2em", height: "2em" }}
            />
          </Link>
          <Typography
            variant="h6"
            noWrap
            // component="a"
            // href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link
              to="/"
              style={{ textDecoration: "inherit", color: "inherit" }}
            >
              PERN CRM !
            </Link>
          </Typography>

          {/* Nav Menu xs view */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem selected={page.toLowerCase() === location ? true : false} key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" className="dark:text-zinc-300">
                    <Link
                      to={pagesLink[index]}
                      style={{ textDecoration: "inherit", color: "inherit" }}
                    >
                      {page}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
              <Divider />
              {!isAuthenticated && (
                <Box>
                  <MenuItem selected={location === config.loginPath.replace("/", "").toLowerCase()} onClick={handleCloseNavMenu}>
                    <Link
                      style={{ textDecoration: "inherit", color: "inherit" }}
                      to={config.loginPath}
                    >
                      <IconButton className="text-sm gap-1 p-0 text-zinc-700 dark:text-zinc-200">
                        Log In <LoginRounded />
                      </IconButton>
                    </Link>
                  </MenuItem>
                  <MenuItem selected={location === config.usersRegisterPath.replace("/", "").toLowerCase()} onClick={handleCloseNavMenu}>
                    <Link
                      style={{ textDecoration: "inherit", color: "inherit" }}
                      to={config.usersRegisterPath}
                    >
                      <IconButton className="text-sm gap-1 p-0 text-zinc-700 dark:text-zinc-200">
                        Sign Up <PersonAddIcon />
                      </IconButton>
                    </Link>
                  </MenuItem>
                </Box>
              )}
              {isAuthenticated && (
                <MenuItem onClick={handleCloseNavMenu}>
                  <IconButton
                    className="text-sm gap-1 p-0 text-zinc-700 dark:text-zinc-200"
                    onClick={handleLogout}
                  >
                    Log Out <LogoutRounded />
                  </IconButton>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Home LOGO xs view */}
          {/* <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} /> */}
          <Link
            to="/"
            className="md:hidden mr-2"
          >
            <img
              src={Logo}
              alt="React logo"
              style={{ width: "2em", height: "2em" }}
            />
          </Link>
          <Typography
            variant="h5"
            noWrap
            // component="a"
            // href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link
              to="/"
              style={{ textDecoration: "inherit", color: "inherit" }}
            >
              PERN CRM !
            </Link>
          </Typography>

          {/* Nav Menu md view */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => (
              <Link
                to={pagesLink[index]}
                key={page}
                style={{ textDecoration: "inherit", color: "inherit" }}
              >
                <Button
                  className="dark:text-zinc-300 capitalize text-base"
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "black", display: "block" }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>

          {/* Authentication button md view */}
          <Box sx={{ flexGrow: 0, mr: 2 }} className="hidden md:flex">
            {!isAuthenticated && (
              <>
                <Link
                  style={{ textDecoration: "inherit", color: "inherit" }}
                  to={config.usersRegisterPath}
                >
                  <Button
                    variant={"contained"}
                    size={"small"}
                    sx={{ textTransform: "capitalize", mr: 1 }}
                  >
                    Register
                  </Button>
                </Link>
                <Link
                  style={{ textDecoration: "inherit", color: "inherit" }}
                  to={`${config.loginPath}`}
                >
                  <Button
                    variant={"contained"}
                    color={"success"}
                    size={"small"}
                    sx={{ textTransform: "capitalize", mr: 1 }}
                    className="text-zinc-900"
                  >
                    Log In
                  </Button>
                </Link>
              </>
            )}
            {isAuthenticated && (
              <Button
                variant={"contained"}
                color={"error"}
                size={"small"}
                sx={{ textTransform: "capitalize" }}
                className={"btnLogOut"}
                onClick={handleLogout}
              >
                Log Out
              </Button>
            )}
            {/* <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip> 
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu> */}
          </Box>
          <SwitchDarkMode />
          {/* <BtnMenuDarkMode /> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
