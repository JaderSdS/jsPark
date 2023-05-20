import { Box, Button, Grid } from "@mui/material";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { Email, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fireAuth } from "../../services/firebaseService";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Layout from "../../components/layout";
export default function LoginAdm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(fireAuth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("AdmLoged");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const handleCreateUser = () => {
    createUserWithEmailAndPassword(fireAuth, email, password)
      .then((userCredential) => {
        debugger;
        // Signed in
        const user = userCredential.user;
        navigate("AdmLoged");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  const menuItems = [
    { label: "Página 1", link: "/pagina1" },
    { label: "Página 2", link: "/pagina2" },
    { label: "Página 3", link: "/pagina3" },
  ];
  return (
    <Layout menuItems={menuItems}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={4} md={4}>
            <img
              width="100%"
              src="https://www.cimentoitambe.com.br/wp-content/uploads/2020/09/garagem_POA-min.jpg"
              alt="estacionamento"
            />
          </Grid>
          <Grid
            style={{
              marginTop: "32px",
              alignItems: "center",
              justifyContent: "center",
            }}
            item
            xs={8}
            md={8}
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
              <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
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
              <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
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
                <Button style={{ margin: "10px" }} variant="outlined">
                  Cadastro
                </Button>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
