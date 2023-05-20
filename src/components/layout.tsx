import React from "react";
import {
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
interface SidebarMenuItem {
  label: string;
  link: string;
}

interface LayoutProps {
  menuItems: SidebarMenuItem[];
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ menuItems, children }) => {
  return (
    <Grid container>
      <Grid item xs={2}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid container direction="column">
          {menuItems.map((item, index) => (
            <Grid item key={index}>
              <Typography>{item.label}</Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={10}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Header</Typography>
            <Button color="inherit">
              <ExitToAppIcon />
              Sair
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <img src="path/to/image" alt="Logo" />
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <Grid item xs={10}>
            {children}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Layout;
