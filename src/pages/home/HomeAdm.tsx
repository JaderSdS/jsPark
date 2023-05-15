import { Box, Grid } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
export default function HomeAdm() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4} md={4}>
          <h1>Login do adm feito</h1>
        </Grid>
      </Grid>
    </Box>
  );
}
