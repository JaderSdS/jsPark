import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { Email, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fireAuth } from "../../services/firebaseService";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useSnackbar } from "notistack";

export default function LoginEsta() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { enqueueSnackbar } = useSnackbar();

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(fireAuth, email, password)
      .then((userCredential) => {
        enqueueSnackbar("Bem vindo novamente", { variant: "success" });
        navigate("/createTicket");
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found")
          enqueueSnackbar("Usuário não encontrado", { variant: "error" });
        if (error.code === "auth/wrong-password")
          enqueueSnackbar("Senha incorreta", { variant: "error" });
        if (error.code === "auth/invalid-email")
          enqueueSnackbar("Email inválido", { variant: "error" });

        enqueueSnackbar("Erro ao logar", { variant: "error" });
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <Grid
        container
        alignItems={"center"}
        justifyContent={"center"}
        spacing={2}
      >
        <Grid
          style={{
            marginTop: "32px",
            alignItems: "center",
            justifyContent: "center",
          }}
          item
          xs={12}
          md={12}
          sm={12}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3">
              Bem vindo usuário, faça login ou crie sua conta
            </Typography>
            <FormControl
              sx={{ m: 1, width: "90%", marginTop: "36px" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Email
              </InputLabel>
              <FilledInput
                onChange={(event) => setEmail(event.target.value)}
                id="outlined-adornment-password"
                type={"text"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="email icon" edge="end">
                      <Email />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "90%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <FilledInput
                onChange={(event) => setPassword(event.target.value)}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Button
                style={{ margin: "10px" }}
                variant="contained"
                onClick={() => {
                  handleLogin();
                }}
              >
                Login
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant="contained"
                onClick={() => {
                  navigate("/createUser");
                }}
              >
                Criar conta
              </Button>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
