import React from "react";
import { Grid, AppBar, Toolbar, Typography, Button } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
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
  return (
    <Grid container>
      <Grid item xs={12}>
        <AppBar position="static">
          <Toolbar>
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
