/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { AuthContext } from "../../contexts/UserContext";
import { userMenus } from "./CreateUser";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  Abc,
  CalendarMonth,
  ColorLens,
  DirectionsCar,
  MinorCrash,
} from "@mui/icons-material";
import { setDoc, doc, getDocs } from "firebase/firestore";
import { carsRef, fireDb } from "../../services/firebaseService";
import { useSnackbar } from "notistack";

export interface CarInterface {
  id: string;
  name: string;
  plate: string;
  color: string;
  model: string;
  year: string;
  owner: string;
  alert: boolean;
}

export const CreateCar: React.FC = () => {
  const navigate = useNavigate();
  const contextUser = useContext(AuthContext);
  const [plate, setPlate] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [owner] = useState(contextUser?.uid);
  const [alert, setAlert] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  //how to get parameter from url
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const getCar = async () => {
        const car = await getDocs(carsRef);
        const carData = car.docs
          .map((doc) => doc.data())
          .find((car) => car.id === id);
        if (carData) {
          setPlate(carData.plate);
          setColor(carData.color);
          setModel(carData.model);
          setYear(carData.year);
          setAlert(carData.alert);
        }
      };
      getCar();
    }
  }, []);

  const handleCreateCar = async () => {
    if (!plate || !color || !model || !year) {
      enqueueSnackbar("Preencha todos os campos", {
        variant: "error",
      });
      return;
    }

    const car: CarInterface = {
      id: plate.toUpperCase(),
      name: plate.toUpperCase(),
      plate: plate.toUpperCase(),
      color: color,
      model: model,
      year: year,
      owner: owner!,
      alert: alert,
    };

    if (id && id !== car.id) {
      if (await isDuplicate(car.id)) {
        enqueueSnackbar("Carro já cadastrado", {
          variant: "error",
        });
        return;
      }

      await setDoc(doc(fireDb, "carros", car.id), car)
        .then(() => {
          enqueueSnackbar("Carro cadastrado com sucesso", {
            variant: "success",
          });
          navigate("/userProfile");
        })
        .catch((error) => {
          if (error.code === "permission-denied") {
            enqueueSnackbar("Você não tem permissão para cadastrar carro", {
              variant: "error",
            });
          }
          if (error.code === "already-exists") {
            enqueueSnackbar("Carro já cadastrado", {
              variant: "error",
            });
          }
          if (error.code === "invalid-argument") {
            enqueueSnackbar("Dados inválidos", {
              variant: "error",
            });
          }
          enqueueSnackbar("Erro ao cadastrar carro", {
            variant: "error",
          });
        });
    } else {
      await setDoc(doc(fireDb, "carros", car.id), car)
        .then(() => {
          enqueueSnackbar("Carro atualizado com sucesso", {
            variant: "success",
          });
          navigate("/userProfile");
        })
        .catch((error) => {
          if (error.code === "permission-denied") {
            enqueueSnackbar("Você não tem permissão para editar carro", {
              variant: "error",
            });
          }
          if (error.code === "invalid-argument") {
            enqueueSnackbar("Dados inválidos", {
              variant: "error",
            });
          }
          enqueueSnackbar("Erro ao atualizar carro", {
            variant: "error",
          });
        });
    }
  };

  const isDuplicate = async (plate: string) => {
    const cars = await getDocs(carsRef);
    const car = cars.docs.find((car) => car.id === plate);
    return car;
  };

  return (
    <Layout menuItems={userMenus}>
      <Grid
        container
        sx={{ marginTop: "32px" }}
        direction="column"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <Typography style={{ marginTop: "16px" }} variant="h4">
            Cadastro de carro
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            sx={{ minWidth: 300 }}
            label="Placa"
            variant="outlined"
            fullWidth
            value={plate}
            disabled={id !== undefined}
            onChange={(e) => setPlate(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <DirectionsCar />
                </InputAdornment>
              ),
            }}
            inputProps={{ maxLength: 7 }}
          />
        </Grid>
        <Grid item>
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
                  <Abc />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            sx={{ minWidth: 300 }}
            label="Cor"
            variant="outlined"
            fullWidth
            value={color}
            onChange={(e) => setColor(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ColorLens />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            sx={{ minWidth: 300 }}
            label="Modelo"
            variant="outlined"
            fullWidth
            value={model}
            onChange={(e) => setModel(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MinorCrash />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            sx={{ minWidth: 300 }}
            label="Ano"
            variant="outlined"
            fullWidth
            value={year}
            onChange={(e) => setYear(e.target.value)}
            inputProps={{ maxLength: 4 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarMonth />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                name="alert"
                checked={alert}
                onChange={(e) => setAlert(e.target.checked)}
              />
            }
            label="Alerta"
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleCreateCar}>
            Cadastrar
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};
