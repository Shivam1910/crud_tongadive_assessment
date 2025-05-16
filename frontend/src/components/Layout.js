import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bulk Data Manager
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<ListIcon />}
            sx={{ mr: 2 }}
          >
            List
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/create"
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            minHeight: "100%",
          }}
        >
          {children}
        </Paper>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Bulk Data Manager
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
