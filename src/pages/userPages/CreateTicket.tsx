/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "../../components/Layout";
import {
  ParkingTicket,
  allServices,
  checkIfDuplicatedPlate,
  getLastTicket,
} from "../estacionamento/checkIn";
import {
  fireDb,
  parkingLotRef,
  usersRef,
} from "../../services/firebaseService";
import { closeSnackbar, useSnackbar } from "notistack";
import QRCode from "react-qr-code";
import { CloseOutlined, Print } from "@mui/icons-material";
import { userMenus } from "./CreateUser";
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
import { useNavigate } from "react-router-dom";
import { CarInterface } from "./CreateCar";
import { getUserCars } from "./UserProfile";
import {
  Estado,
  City,
  ParkingLotInterface,
  states,
} from "../administrador/ParkingLotCreateEdit";
export const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const contextUser = useContext(AuthContext);
  const [selectedState, setSelectedState] = useState<Estado | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
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
  };

  const handleCityChange = (event: any) => {
    const cityId = event.target.value as number;
    const city = selectedState?.cidades.find((city) => cityId === city.id);
    setSelectedCity(city || null);
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

  const handlePrint = () => {
    const conteudo = document.getElementById("conteudo-impressao");
    if (conteudo) {
      const janelaImprimir = window.open("", "_blank");
      janelaImprimir?.document.write(conteudo.innerHTML);
      janelaImprimir?.document.close();
      janelaImprimir?.print();
    }
  };

  const handleCreateTicket = async () => {
    if (await checkIfDuplicatedPlate(selectedCar!.plate)) {
      enqueueSnackbar("Já existe um ticket para esse carro", {
        variant: "error",
      });
    } else {
      const ticket: ParkingTicket = {
        plate: selectedCar!.plate,
        entryTime: new Date().getTime(),
        exitTime: 0,
        id: await getLastTicket(),
        cnpj: selectedParkingLot!.cnpj.toString(),
        services: [],
        color: selectedCar!.color,
        paymentMethod: "",
        value: 0,
        status: "Open",
      };
      await setDoc(doc(fireDb, "tickets", ticket.id), ticket).then((docRef) => {
        const action = (snackbarId: any) => (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrint}
              id="btnImprimir"
            >
              <Print />
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => closeSnackbar(snackbarId)}
              id="btnFechar"
            >
              <CloseOutlined />
            </Button>
          </>
        );
        const style = {
          alignItems: "center",
          justifyContent: "center",
        };
        enqueueSnackbar(
          <Grid container spacing={2}>
            <Grid item style={style} sm={12} md={12}>
              <Typography variant="h6"> Ticket gerado com sucesso </Typography>
            </Grid>
            <div id="conteudo-impressao">
              <Grid item style={style} sm={12} md={12}>
                <QRCode value={JSON.stringify(ticket)} size={150} />
              </Grid>
              <Grid item style={style} sm={12} md={12}>
                Placa: {ticket.plate}
              </Grid>
              <Grid item style={style} sm={12} md={12}>
                Entrada: {new Date(ticket.entryTime).toLocaleString()}
              </Grid>
              <Grid item style={style} sm={12} md={12}>
                Cor: {ticket.color}
              </Grid>
              <Grid item style={style} sm={12} md={12}>
                Cnpj: {selectedParkingLot!.cnpj}
              </Grid>
            </div>
          </Grid>,
          { action, autoHideDuration: 10000 }
        );
      });
    }
  };

  //função para pegar o dia da semana e ver qual o horário de funcionamento do estacionamento
  const getDay = () => {
    var diasSemana = [
      "Domingo",
      "Segunda-Feira",
      "Terça-Feira",
      "Quarta-Feira",
      "Quinta-Feira",
      "Sexta-Feira",
      "Sábado",
    ];

    const today = new Date();
    const day = today.getDay();
    const parkingLot = selectedParkingLot;
    if (parkingLot) {
      let weekDays = Object.keys(parkingLot.openingHours).map((key) => {
        return { [key]: parkingLot.openingHours[key] };
      });

      let ordered = weekDays.sort((a, b) => {
        debugger;
        if (
          diasSemana.indexOf(Object.keys(a)[0]) >
          diasSemana.indexOf(Object.keys(b)[0])
        ) {
          return 1;
        } else {
          return -1;
        }
      });
      console.log(ordered)
      switch (day) {
        case 0:
          let string0 = parkingLot.openingHours["Domingo"];
          return `das ${string0.openingTime} às ${string0.closingTime}`;
        case 1:
          let string1 = parkingLot.openingHours["Segunda-Feira"];
          return `das ${string1.openingTime} às ${string1.closingTime}`;
        case 2:
          let string2 = parkingLot.openingHours["Terça-Feira"];
          return `das ${string2.openingTime} às ${string2.closingTime}`;
        case 3:
          let string3 = parkingLot.openingHours["Quarta-Feira"];
          return `das ${string3.openingTime} às ${string3.closingTime}`;
        case 4:
          let string4 = parkingLot.openingHours["Quinta-Feira"];
          return `das ${string4.openingTime} às ${string4.closingTime}`;
        case 5:
          let string5 = parkingLot.openingHours["Sexta-Feira"];
          return `das ${string5.openingTime} às ${string5.closingTime}`;
        case 6:
          let string6 = parkingLot.openingHours["Sábado"];
          return `das ${string6.openingTime} às ${string6.closingTime}`;
      }
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
              <strong>Vagas disponíveis</strong> : 30 / 100
            </Typography>
            <Typography variant="body1" sx={{ margin: "4px" }}>
              <strong>Telefone</strong> : {selectedParkingLot.phone}
            </Typography>
            <Typography variant="body1" sx={{ margin: "4px" }}>
              <strong>Aberto hoje</strong> das 08:00 às 19:00
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
                <Typography variant="body1" >
                  até 1 hora:
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" >
                  R$ {selectedParkingLot.prices.hourlyRate.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" >
                  até 2 horas:
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" >
                  R$ {(selectedParkingLot.prices.hourlyRate * 2).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" >
                  até 3 horas:
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" >
                  R$ {(selectedParkingLot.prices.hourlyRate * 3).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" >
                  até 4 horas:
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" >
                  R$ {(selectedParkingLot.prices.hourlyRate * 4).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" >
                  Diária:
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="body1" >
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
