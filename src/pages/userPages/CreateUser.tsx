import { useSnackbar } from "notistack";
import Layout from "../../components/Layout";
import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Estado, City, states } from "../crud/parkingLot/ParkingLotCreateEdit";
import { getDocs, collection, setDoc, doc } from "firebase/firestore";
import { fireAuth, fireDb, usersRef } from "../../services/firebaseService";
import {
  Badge,
  Email,
  Password,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";

export interface UserProps {
  id: string;
  name: string;
  email: string;
  state: number;
  city: number;
}

export const userMenus = [
  { label: "Gerar ticket", link: "/createTicket" },
  { label: "Histórico", link: "/ticketsHistory" },
  { label: "Perfil", link: "/editUser" },
];

export const CreateUser: React.FC = () => {
  //form to create a new user
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState(0);
  const [city, setCity] = useState(0);

  const [selectedState, setSelectedState] = useState<Estado | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { enqueueSnackbar } = useSnackbar();
  const handleStateChange = (event: any) => {
    const stateId = event.target.value as number;
    const state = states.find((state) => stateId === state.id);
    setSelectedState(state || null);
    setState(stateId);
    setSelectedCity(null);
  };

  const handleCityChange = (event: any) => {
    const cityId = event.target.value as number;
    const city = selectedState?.cidades.find((city) => cityId === city.id);
    setSelectedCity(city || null);
    setCity(cityId);
  };

  const checkEmail = async () => {
    let emailExists = false;
    let users = await getDocs(usersRef);

    let usersData = users.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as UserProps;
    });

    usersData.forEach((user) => {
      if (user.email === email) {
        emailExists = true;
      }
    });

    return emailExists;
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const createUserInDb = async () => {
    if (await checkEmail()) {
      return;
    }
    createUserWithEmailAndPassword(fireAuth, email, password)
      .then(async (user) => {
        const newUser = {
          name: name,
          email: email,
          state: state,
          city: city,
          id: user.user.uid,
        };
        await setDoc(doc(fireDb, "usuarios", newUser.id), newUser)
          .then(() => {
            enqueueSnackbar("Usuário criado com sucesso", {
              variant: "success",
            });
            navigate("/LoginUsuario");
          })
          .catch((error) => {
            enqueueSnackbar("Erro ao criar usuário", { variant: "error" });
          });
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          enqueueSnackbar("Senha fraca", { variant: "error" });
        }
        if (error.code === "auth/email-already-in-use") {
          enqueueSnackbar("Email já cadastrado", { variant: "error" });
        }
        if (error.code === "auth/invalid-email") {
          enqueueSnackbar("Email inválido", { variant: "error" });
        }
        if (error.code === "auth/operation-not-allowed") {
          enqueueSnackbar("Operação não permitida", { variant: "error" });
        }
      });
  };
  return (
    <Grid
      container
      sx={{ marginTop: "32px" }}
      direction="column"
      alignItems="center"
      spacing={2}
    >
      <Grid item>
        <Typography variant="h3">
          Bem vindo usuário crie sua conta e aproveite
        </Typography>
      </Grid>
      <Grid item xs={6} md={12} sm={12}>
        <TextField
          sx={{ minWidth: 300 }}
          label="Nome"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Badge />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={6} md={12} sm={12}>
        <TextField
          sx={{ minWidth: 300 }}
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Email />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={6} md={12} sm={12}>
        <TextField
          sx={{ minWidth: 300 }}
          label="Senha"
          variant="outlined"
          fullWidth
          value={password}
          InputProps={{
            endAdornment: (
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
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Grid>
      <Grid item xs={6} md={12} sm={12}>
        <InputLabel>Estado</InputLabel>
        <Select
          sx={{ minWidth: 300 }}
          value={selectedState?.id || ""}
          onChange={(event) => handleStateChange(event)}
        >
          {states.map((state) => (
            <MenuItem key={state.id} value={state.id}>
              {state.nome}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12} sm={12}>
        <InputLabel>Cidade</InputLabel>
        <Select
          sx={{ minWidth: 300 }}
          value={selectedCity?.id || 0}
          onChange={(event) => handleCityChange(event)}
        >
          {selectedState ? (
            selectedState.cidades.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.nome}
              </MenuItem>
            ))
          ) : (
            <MenuItem key={"unselectedState"} value={0} disabled>
              Selecione um estado
            </MenuItem>
          )}
        </Select>
      </Grid>
      <Grid
        item
        xs={6}
        md={12}
        sm={12}
        sx={{
          width: "300px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button variant="contained" color="primary" onClick={createUserInDb}>
          Criar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/LoginUsuario")}
        >
          Voltar
        </Button>
      </Grid>
    </Grid>
  );
};
