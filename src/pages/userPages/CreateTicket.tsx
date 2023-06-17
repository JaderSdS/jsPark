/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "../../components/Layout";
import {
  ParkingTicket,
  allServices,
  checkIfDuplicatedPlate,
  estaMenus,
  getLastTicket,
} from "../estacionamento/checkIn";
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
import { doc, getDocs, setDoc } from "firebase/firestore";
import {
  City,
  Estado,
  ParkingLotInterface,
  states,
} from "../crud/parkingLot/ParkingLotCreateEdit";
import { useNavigate } from "react-router-dom";
import { CarInterface } from "./CreateCar";
import { getUserCars } from "./UserProfile";
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
  const [parkingLotServices, setParkingLotServices] = useState<string[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarInterface | null>(null);
  const [userCars, setUserCars] = useState<CarInterface[]>([]);

  useEffect(() => {
    findUser()
      .then((user) => {
        setParkingUser(user as UserProps);
        const state = states.find((state) => user?.state === state.id);
        setSelectedState(state!);
        const city = state?.cidades.find((city) => user?.city === city.id);
        setSelectedCity(city!);

        const getCars = async () => {
          const cars = await getUserCars(contextUser?.uid || "");
          setUserCars(cars as CarInterface[]);
        };
        getCars();
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

  const handleCreateTicket = async () => {
    if (await checkIfDuplicatedPlate(selectedCar!.plate)) {
      enqueueSnackbar("Já existe um ticket para esse carro", {
        variant: "error",
      });
    } else {
      await getLastTicket();
      const ticket: ParkingTicket = {
        plate: selectedCar!.plate,
        entryTime: new Date().getTime(),
        exitTime: 0,
        id: "",
        cnpj: "",
        services: [],
        color: "",
        paymentMethod: "",
        value: 0,
      };
      await setDoc(doc(ticketsRef), ticket);
      enqueueSnackbar("Ticket gerado com sucesso", { variant: "success" });
    }
  };
  return (
    <Layout menuItems={userMenus}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <Typography style={{ marginTop: "16px" }} variant="h4">
            Criar ticket
          </Typography>
        </Grid>
        <Grid item sx={{ minWidth: "300px" }}>
          <InputLabel>Carro</InputLabel>
          <Select
            fullWidth
            value={selectedCar?.id || ""}
            onChange={(event) => {
              const car = userCars.find((car) => car.id === event.target.value);
              setSelectedCar(car!);
            }}
          >
            {userCars.map((car) => (
              <MenuItem key={car.id} value={car.id}>
                {car.plate}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item sx={{ minWidth: "300px" }}>
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
        <Grid item sx={{ minWidth: "300px" }}>
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
          <Grid item sx={{ minWidth: "300px" }}>
            <InputLabel>Estacionamento</InputLabel>
            <Select
              fullWidth
              value={selectedParkingLot?.cnpj}
              onChange={(event) => {
                const parkingLot = parkingLots.find(
                  (parkingLot) => parkingLot.cnpj === event.target.value
                );
                setSelectedParkingLot(parkingLot!);
                let services: string[] = [];
                Object.keys(parkingLot!.services).map((key: any) => {
                  if (
                    parkingLot!.services[key as keyof typeof allServices] ===
                    true
                  ) {
                    services.push(allServices[key as keyof typeof allServices]);
                  }
                  return null;
                });
                setParkingLotServices(services);
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
          <Grid item sx={{ minWidth: "300px" }}>
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
          <Grid
            item
            sx={{ minWidth: "300px", margin: "8px 8px 8px 16px" }}
            bgcolor={"#D9D9D9"}
          >
            <Typography variant="body1" sx={{ margin: "4px" }}>
              <strong>Informações do estacionamento</strong>
            </Typography>
            <Typography variant="body1" sx={{ margin: "4px" }}>
              <strong>Endereço:</strong> {selectedParkingLot.address} -{" "}
              {selectedCity?.nome}
            </Typography>
            {/* [] TODO PREENCHER VAGAS DISPONIVEIS */}
            <Typography variant="body1" sx={{ margin: "4px" }}>
              <strong>Vagas disponíveis</strong> : 1111 : 1111
            </Typography>
            {parkingLotServices.length > 0 && (
              <Typography variant="body1" sx={{ margin: "4px" }}>
                <strong>Serviços:</strong> {parkingLotServices.join(", ")}
              </Typography>
            )}
            {/** Tabela de preços preenchida com valor do selectedParkingLot.prices*/}
            <Typography variant="body1" sx={{ margin: "4px" }}>
              <strong>Tabela de preços:</strong>
            </Typography>
            <Grid
              container
              direction="row"
              alignItems="center"
              spacing={2}
              columns={{ xs: 4, sm: 4, md: 4 }}
            >
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" sx={{ margin: "4px" }}>
                  até 1 hora:
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" sx={{ margin: "4px" }}>
                  R$ {selectedParkingLot.prices.hourlyRate.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" sx={{ margin: "4px" }}>
                  até 2 horas:
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" sx={{ margin: "4px" }}>
                  R$ {(selectedParkingLot.prices.hourlyRate * 2).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" sx={{ margin: "4px" }}>
                  até 3 horas:
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" sx={{ margin: "4px" }}>
                  R$ {(selectedParkingLot.prices.hourlyRate * 3).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" sx={{ margin: "4px" }}>
                  até 4 horas:
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" sx={{ margin: "4px" }}>
                  R$ {(selectedParkingLot.prices.hourlyRate * 4).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" sx={{ margin: "4px" }}>
                  Diária:
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" sx={{ margin: "4px" }}>
                  R$ {selectedParkingLot.prices.dailyRate.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              sx={{
                width: "100%",
                display: "flex",
                marginTop: "16px",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => handleCreateTicket()}
                variant="contained"
                color="primary"
              >
                Gerar
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};
