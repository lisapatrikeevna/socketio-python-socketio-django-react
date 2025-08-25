import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { PATH } from "../paths.ts";

const HomePage = () => {
  return (
    <Box p={4}>
      <Typography variant="h4">HomePage</Typography>
      <hr />
      <NavLink to={PATH.login}>Login</NavLink> | <NavLink to={PATH.register}>Register</NavLink>
    </Box>
  );
};

export default HomePage;