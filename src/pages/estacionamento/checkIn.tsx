import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { setDoc, doc, getDocs, query, where } from "firebase/firestore";
import {
  carsRef,
  fireDb,
  parkingLotRef,
  ticketsRef,
} from "../../services/firebaseService";
import { AuthContext } from "../../contexts/UserContext";
import { closeSnackbar, useSnackbar } from "notistack";
import QRCode from "react-qr-code";
import { CloseOutlined, Print } from "@mui/icons-material";
import {
  Estado,
  ParkingLotInterface,
} from "../administrador/ParkingLotCreateEdit";
import { sendEmail } from "../../services/emailService";
import estadosCidades from "../../services/estadosCidades.json";
import Layout from "../../components/layout";
interface ParkingFormProps {
  onSubmit: (formData: ParkingTicket) => void;
}
export const estaMenus = [
  { label: "Check In", link: "/checkIn" },
  { label: "Check Out", link: "/checkOut" },
  { label: "Relatórios", link: "/relatorio" },
];

export interface ParkingTicket {
  id: string;
  cnpj: string;
  plate: string;
  services: string[];
  color: string;
  entryTime: number;
  exitTime: number;
  paymentMethod: string;
  value: number;
  status: "Open" | "Closed" | "Canceled";
}

interface item {
  label: string;
  value: string;
}

export const getLastTicket = async () => {
  const data = await getDocs(ticketsRef);

  let allTickets = data.docs.map((doc) => doc.id);

  var bigger = Number(allTickets[0]);

  for (var i = 1; i < allTickets.length; i++) {
    var actualNumber = Number(allTickets[i]);

    if (actualNumber > bigger) {
      bigger = actualNumber;
    }
  }
  bigger += 1;
  return bigger.toString();
};

export const checkIfDuplicatedPlate = async (plate: string) => {
  const data = await getDocs(ticketsRef);
  let allTickets = data.docs.map((doc) => doc.data());
  let duplicatedPlate = allTickets.filter(
    (ticket) => ticket.plate === plate && ticket.status === "Open"
  );
  if (duplicatedPlate.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const allServices = {
  wifi: "Wi-fi",
  security: "Segurança",
  coveredParking: "Estacionamento coberto",
  disabledParking: "Estacionamento para deficientes",
  carWash: "Lavagem de carro",
  valetService: "Manobrista",
  electricCarCharging: "Carregamento de carro elétrico",
};
export const states: Estado[] = estadosCidades.estados;

const CheckInForm: React.FC<ParkingFormProps> = () => {
  const [plate, setPlate] = useState("");

  const [color, setColor] = useState("");

  const [services, setServices] = useState<string[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const user = useContext(AuthContext);

  const [parkingLot, setParkingLot] = useState<ParkingLotInterface>();

  const [parkingLotServices, setParkingLotServices] = useState<item[]>([]);

  const [usedSpots, setUsedSpots] = useState<number>(0);

  const getParkingLotCnpj = async () => {
    const data = await getDocs(parkingLotRef);
    const parkingLot = data.docs.map((doc) => doc.data());
    const parkingLotCnpj = parkingLot.filter(
      (parkingLot) => parkingLot.email === user?.email
    );
    setParkingLot(parkingLotCnpj[0] as ParkingLotInterface);
    let services: item[] = [];
    Object.keys(parkingLotCnpj[0].services).forEach((element: any) => {
      if (parkingLotCnpj[0].services[element]) {
        let labelT = allServices[element as keyof typeof allServices];
        services.push({
          label: labelT,
          value:
            Object.keys(allServices).find((service) => service === element) ||
            "",
        });
      }
    });
    setParkingLotServices(services);

    getUsedSpots();
  };

  const getUsedSpots = async () => {
    const data = await getDocs(ticketsRef);
    const tickets = data.docs.map((doc) => doc.data());
    const parkingLotTickets = tickets.filter(
      (ticket) => ticket.cnpj === parkingLot?.cnpj && ticket.status === "Open"
    );
    setUsedSpots(parkingLotTickets.length);
  };

  useEffect(() => {
    getParkingLotCnpj();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (parkingLot) {
      getUsedSpots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parkingLot]);

  const handlePlateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const sanitizedValue = value.slice(0, 7).replace(/[^a-zA-Z0-9]/g, "");
    setPlate(sanitizedValue.toUpperCase());
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
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

  const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setServices((prevServices) => {
      if (checked) {
        return [...prevServices, value];
      } else {
        return prevServices.filter((service) => service !== value);
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (plate.length < 7) {
      enqueueSnackbar("Placa inválida", { variant: "error" });
      return;
    }

    if (await checkIfDuplicatedPlate(plate)) {
      enqueueSnackbar("Placa já cadastrada", { variant: "error" });
      return;
    }

    const formData: ParkingTicket = {
      entryTime: Date.now(),
      plate,
      color,
      services,
      cnpj: parkingLot!.cnpj.toString(),
      exitTime: 0,
      paymentMethod: "",
      value: 0,
      id: await getLastTicket(),
      status: "Open",
    };

    await setDoc(doc(fireDb, "tickets", formData.id), formData);
    getCarInfo(plate);
    getUsedSpots();
    const style = {
      alignItems: "center",
      justifyContent: "center",
    };
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
    enqueueSnackbar(
      <Grid container spacing={2}>
        <Grid item style={style} sm={12} md={12}>
          <Typography variant="h6"> Ticket gerado com sucesso </Typography>
        </Grid>
        <div id="conteudo-impressao">
          <Grid item style={style} sm={12} md={12}>
            <QRCode value={JSON.stringify(formData)} size={150} />
          </Grid>
          <Grid item style={style} sm={12} md={12}>
            Placa: {plate}
          </Grid>
          <Grid item style={style} sm={12} md={12}>
            Entrada: {new Date(formData.entryTime).toLocaleString()}
          </Grid>
          <Grid item style={style} sm={12} md={12}>
            Cor: {color}
          </Grid>
          <Grid item style={style} sm={12} md={12}>
            Cnpj: {parkingLot!.cnpj}
          </Grid>
          <Grid item style={style} sm={12} md={12}>
            Serviços: {services}
          </Grid>
        </div>
      </Grid>,
      { action, autoHideDuration: 10000 }
    );

    setColor("");
    setPlate("");
  };

  const getCarInfo = async (plate: string) => {
    const carQuery = query(carsRef, where("plate", "==", plate));
    const data = await getDocs(carQuery);
    const car = data.docs.map((doc) => doc.data());
    if (car.length > 0) {
      if (car[0].alert) {
        let estadocidade = await getCityAndState(
          parkingLot!.state,
          parkingLot!.city
        );
        await sendEmail(
          plate,
          parkingLot!,
          car[0].owner,
          estadocidade.state,
          estadocidade.city
        );
      }
    }
  };

  const getCityAndState = async (stateID: number, cityID: number) => {
    const state = states.find((state) => state.id === stateID);
    const city = state!.cidades.find((city) => city.id === cityID);
    return { state: state!.nome, city: city!.nome };
  };

  // Array para armazenar os registros dos tíquetes de estacionamento
  const parkingTickets: ParkingTicket[] = [];

  // Função para gerar um número aleatório entre dois valores
  function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Função para gerar uma data aleatória nos últimos 30 dias
  function getRandomDateWithinLast30Days(): Date {
    const today = new Date();
    const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // Subtrai 30 dias em milissegundos
    const endDate = today.getTime();
    const randomTimestamp = getRandomNumber(startDate.getTime(), endDate);
    return new Date(randomTimestamp);
  }

  // Função para gerar um horário de entrada aleatório entre 08:00 e 18:00
  function getRandomEntryTime(): Date {
    const entryTime = getRandomDateWithinLast30Days();
    entryTime.setHours(getRandomNumber(8, 18), getRandomNumber(0, 59), 0, 0);
    return entryTime;
  }

  // Função para gerar um horário de saída aleatório após o horário de entrada
  function getRandomExitTime(entryTime: Date): Date {
    const exitTime = new Date(entryTime);
    exitTime.setHours(entryTime.getHours() + getRandomNumber(1, 10)); // Adiciona 1 a 10 horas ao horário de entrada
    return exitTime;
  }

  function getRandonPaymentMethod(): string {
    const paymentMethods = [
      "Dinheiro",
      "Cartão de crédito",
      "Cartão de débito",
    ];
    const randomIndex = getRandomNumber(0, paymentMethods.length - 1);
    return paymentMethods[randomIndex];
  }

  function creatAlotOfTickets() {
    // Loop para gerar os registros dos tíquetes de estacionamento
    for (let i = 0; i < 10; i++) {
      const entryTime = getRandomEntryTime();
      const exitTime = getRandomExitTime(entryTime);

      const parkingTicket: ParkingTicket = {
        id: `Ticket${i + 1}`,
        cnpj: "CNPJ do estacionamento",
        plate: "ABC123",
        services: ["Serviço 1", "Serviço 2"],
        color: "Vermelho",
        entryTime: entryTime.getTime(),
        exitTime: exitTime.getTime(),
        paymentMethod: getRandonPaymentMethod(),
        value: calculateAmountPaid(entryTime.getTime(), exitTime.getTime()),
        status: "Closed",
      };

      parkingTickets.push(parkingTicket);
    }

    console.log(parkingTickets);
  }
  
  const calculateAmountPaid = (entryTime: number, exitTime: number): number => {
    const permanenceTime = (exitTime - entryTime) / 3600000;

    if (permanenceTime < 1) {
      return parkingLot!.prices.hourlyRate;
    }

    if (permanenceTime > 5) {
      return parkingLot!.prices.dailyRate;
    }
    const amountPaid = permanenceTime * parkingLot!.prices.hourlyRate;
    return amountPaid;
  };
  return (
    <Layout menuItems={estaMenus}>
      <Button onClick={creatAlotOfTickets}>GERA TICKETS PAKAS</Button>
      <Grid container spacing={2}>
        <Grid item xs={6} md={12} sm={12}>
          <Typography style={{ marginTop: "16px" }} variant="h4">
            Registrar entrada
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sm={12}>
          <TextField
            label="Placa"
            value={plate}
            onChange={handlePlateChange}
            fullWidth
            required
            inputProps={{ maxLength: 7 }}
          />
        </Grid>
        <Grid item xs={12} md={6} sm={12}>
          <TextField
            label="Cor"
            value={color}
            onChange={handleColorChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6} sm={12}>
          {parkingLotServices.length > 0 &&
            //services are an object, how to map it?
            parkingLotServices.map((service) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={services.includes(service.value)}
                      onChange={handleServiceChange}
                      value={service}
                    />
                  }
                  label={service.label}
                />
              );
            })}
        </Grid>
        {parkingLot && (
          <Grid item xs={12} md={12} sm={12}>
            <Typography variant="h6">
              Vagas disponiveis: {parkingLot.totalSpots - usedSpots} /{" "}
              {parkingLot!.totalSpots}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} md={12} sm={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Registrar
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CheckInForm;
