import { createTheme } from "@mui/material";
import { createRoot } from "react-dom/client";
import { T_Theme } from "../context/ContextAPI"
const rootElement = document.getElementById("root");

// All `Portal`-related components need to have the the main app wrapper element as a container
// so that the are in the subtree under the element used in the `important` option of the Tailwind's config.

const getCustomTheme = (mode: T_Theme) => {
  return createTheme({
    typography: {
      fontFamily: "'Lato', sans-serif",
    },
    palette: {
      mode: mode === "dark" ? "dark" : "light",
      primary: {
        main: "#1e293b",
      },
      secondary: {
        main: "#EF6C00",
        dark: "#A95006",
        light: "#FF9D4B",
      },
      error: {
        main: "#F44336",
        dark: "#E31B0C",
        light: "#F88078",
      },
      warning: {
        main: "#ED6C02",
        dark: "#C77700",
        light: "#FFB547",
      },
      info: {
        main: "#2196F3",
        dark: "#0B79D0",
        light: "#64B6F7",
      },
      success: {
        main: "#4CAF50",
        dark: "#3B873E",
        light: "#7BC67E",
      },
      text: {
        primary: "#2F3349",
        secondary: "#7A7E98",
        disabled: "#85889B",
      },
      action: {
        active: "rgba(0, 0, 0, 0.54)",
      },
    },
    components: {
      MuiPaper: {
        defaultProps: {
          elevation: 4,
          // className: "p-[1.5rem]"
        },
      },
      MuiTable: {
        defaultProps:{
          className: "dark:text-zinc-200",

        }
      },
      MuiTableCell: {
        defaultProps: {
          className: "dark:text-zinc-400",
        }
      },
      MuiButton: {
        defaultProps: {
          disableRipple: false,
          className: "dark:text-zinc-400"
        },
      },
      MuiSelect: {
        defaultProps: {
          className: "dark:text-zinc-200",
          inputProps: {
            className: "dark:text-zinc-400",
            
          },
          // IconComponent: {
          //   className: "dark:text-zinc-200"
          // }
        }
        
      },
      MuiIcon: {
        defaultProps: {
          className: "dark:text-zinc-200"
          
        }
      },
      MuiMenuItem: {
        defaultProps: {
          className: "dark:text-zinc-200",
        }
      },
      MuiSvgIcon: {
        defaultProps: {
          className: "dark:text-zinc-200",
        
        },
        
      },
      MuiPaginationItem: {
        defaultProps: {
          className: "dark:text-zinc-400",
        },
      },
      MuiTextField: {
        defaultProps: {
          InputProps: {

            className: "dark:text-zinc-300 dark:border-red-500"
          },
          InputLabelProps: {
            className: ""
          },
          
          // className: "dark:text-slate-400 border-white",
          sx: {
            "& .MuiOutlinedInput-root:hover": {
              "& > fieldset": {},
            },
          },
        },
      },
      MuiTablePagination: {
        defaultProps: {
          className: "dark:text-zinc-200"
        }
      },
      MuiInputBase: {
        defaultProps: {
          className: "dark:text-zinc-200",
        },
      },
      MuiInputLabel: {
        defaultProps: {
          // className: "dark:text-slate-400",
        },
      },
      MuiTypography: {
        defaultProps: {
          color: "textPrimary",
          // className: "dark:text-slate-300",
        },
      },
    },
  });
}
export default getCustomTheme;
