import { Box, Button, Grid, Typography } from "@mui/material";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/MeuEstacionamento");
  };

  return (
    <Grid container spacing={2}>
      <Grid item sm={12} md={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://i.imgur.com/qIufhof.png"
            alt="404"
            height={"100px"}
            width={"100px"}
          />
          <Typography variant="h3">Oops... Essa página não existe.</Typography>
          <Typography variant="h5">
            Retorne para Página Inicial no nosso site clicando no botão abaixo
          </Typography>
          <Button onClick={goHome} variant="contained" color="warning">
            Clique aqui
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default memo(NotFound);
