import { useNavigate, Link } from "react-router-dom";

import {
  Button,
  Box,
  Toolbar,
  InputBase,
  styled,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { FcGlobe } from "react-icons/fc";

import AccountMenu from "./AccountMenu"

const TopBar = (props) => {
  const navigate = useNavigate();

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",

    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "60%",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "primary.main",
        mb: 2,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Link to="/home">
          <FcGlobe size={50} />
        </Link>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>

        {!props.posting && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              navigate("/create-post");
            }}
          >
            Post
          </Button>
        )}

        <AccountMenu />

      </Toolbar>
    </Box>
  );
};

export default TopBar;
