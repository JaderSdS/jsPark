import React from "react";
import { Grid, AppBar, Toolbar, Typography, Button } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { fireAuth } from "../services/firebaseService";
import { useSnackbar } from "notistack";
import { signOut } from "firebase/auth";
interface SidebarMenuItem {
  label: string;
  link: string;
}

interface LayoutProps {
  menuItems: SidebarMenuItem[];
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ menuItems, children }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const logOut = () => {
    signOut(fireAuth)
      .then(() => {
        enqueueSnackbar("Sucesso ao deslogar", { variant: "success" });
        navigate("/");
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao deslogar", { variant: "error" });
      });
  };
  return (
    <Grid container>
      <Grid item xs={12}>
        <AppBar position="static">
          <Toolbar
            sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}
          >
            {menuItems.map((item, index) => (
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate(item.link)}
              >
                {item.label}
              </Typography>
            ))}
            <Button
              color="inherit"
              onClick={() => {
                logOut();
              }}
            >
              <ExitToAppIcon />
              Sair
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container justifyContent="center" textAlign="center">
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Layout;
