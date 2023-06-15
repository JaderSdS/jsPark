/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "../../components/Layout";
import { ParkingTicket, estaMenus } from "../estacionamento/checkIn";
import {
  fireDb,
  parkingLotRef,
  ticketsRef,
  usersRef,
} from "../../services/firebaseService";
import { closeSnackbar, useSnackbar } from "notistack";
import QRCode from "react-qr-code";
import { CloseOutlined, Print } from "@mui/icons-material";
import { UserProps, userMenus } from "./CreateUser";
import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { AuthContext } from "../../contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import {
  City,
  Estado,
  ParkingLotInterface,
  states,
} from "../crud/parkingLot/ParkingLotCreateEdit";
import { useNavigate } from "react-router-dom";
export const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const contextUser = useContext(AuthContext);
  const [parkingUser, setParkingUser] = useState<UserProps | null>(null);
  const [selectedState, setSelectedState] = useState<Estado | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [state, setState] = useState(0);
  const [city, setCity] = useState(0);
  const [parkingLots, setParkingLots] = useState<ParkingLotInterface[] | null>(
    null
  );
  const [selectedParkingLot, setSelectedParkingLot] =
    useState<ParkingLotInterface | null>(null);

  useEffect(() => {
    findUser()
      .then((user) => {
        setParkingUser(user as UserProps);
        const state = states.find((state) => user?.state === state.id);
        setSelectedState(state!);
        const city = state?.cidades.find((city) => user?.city === city.id);
        setSelectedCity(city!);
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao encontrar usuário", { variant: "error" });
      });
  }, []);

  const findUser = async () => {
    const data = await getDocs(usersRef);
    const users = data.docs.map((doc) => doc.data());
    const user = users.find((user) => user.email === contextUser?.email);
    if (!user) {
      navigate("/LoginUsuario");
    } else {
      return user;
    }
  };

  const handleStateChange = (event: any) => {
    const stateId = event.target.value as number;
    const state = states.find((state) => stateId === state.id);
    setSelectedState(state || null);
    setSelectedCity(null);
    setState(stateId);
  };
  const handleCityChange = (event: any) => {
    const cityId = event.target.value as number;
    const city = selectedState?.cidades.find((city) => cityId === city.id);
    setSelectedCity(city || null);
    setCity(cityId);
  };

  const handleFindParkingLot = async () => {
    console.log("cidade", selectedCity?.id, "estado", selectedState?.id);

    const data = await getDocs(parkingLotRef);
    const parkingLots = data.docs.map((doc) => doc.data());
    const parkingLot = parkingLots.filter((parkingLot) => {
      debugger;
      if (
        parkingLot.city === selectedCity?.id &&
        parkingLot.state === selectedState?.id
      )
        return parkingLot;
    });
    if (!parkingLot) {
      enqueueSnackbar("Estacionamento não encontrado", { variant: "error" });
    } else {
      setParkingLots(parkingLot as ParkingLotInterface[]);
    }
  };

  return (
    <Layout menuItems={userMenus}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <Typography style={{ marginTop: "16px" }} variant="h4">
            Criar ticket
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          Lista de carros
        </Grid>
        <Grid item xs={12} md={6} sm={12}>
          <InputLabel>Estado</InputLabel>
          <Select
            fullWidth
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
            fullWidth
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
        {parkingLots && parkingLots.length > 0 ? (
          <Grid item xs={12} sm={12} md={12}>
            <InputLabel>Estacionamento</InputLabel>
            <Select
              fullWidth
              value={selectedParkingLot?.cnpj}
              onChange={(event) => {
                const parkingLot = parkingLots.find(
                  (parkingLot) => parkingLot.cnpj === event.target.value
                );
                setSelectedParkingLot(parkingLot!);
              }}
            >
              {parkingLots.map((parkingLot) => (
                <MenuItem key={parkingLot.cnpj} value={parkingLot.cnpj}>
                  {parkingLot.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        ) : (
          <Grid item xs={12} sm={12} md={12}>
            <Button
              onClick={() => handleFindParkingLot()}
              variant="contained"
              color="primary"
            >
              Buscar
            </Button>
          </Grid>
        )}
        {selectedParkingLot && (
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="body1">{selectedParkingLot.name}</Typography>
            <Typography variant="body1">{selectedParkingLot.cnpj}</Typography>
            <Typography variant="body1">
              {selectedParkingLot.address}
            </Typography>
            <Typography variant="body1">{selectedParkingLot.city}</Typography>
            <Typography variant="body1">{selectedParkingLot.state}</Typography>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};
