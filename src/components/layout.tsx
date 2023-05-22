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
      <Grid item xs={12}>
        <AppBar position="static">
          <Toolbar>
            {menuItems.map((item, index) => (
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {item.label}
              </Typography>
            ))}
            <Button color="inherit">
              <ExitToAppIcon />
              Sair
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Layout;
