import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import Layout from "../../components/Layout";
import { setDoc, doc, getDocs } from "firebase/firestore";
import {
  fireDb,
  parkingLotRef,
  ticketsRef,
} from "../../services/firebaseService";
import { AuthContext } from "../../contexts/UserContext";
import { closeSnackbar, useSnackbar } from "notistack";
import QRCode from "react-qr-code";
import { CloseOutlined, Print } from "@mui/icons-material";

interface ParkingFormProps {
  onSubmit: (formData: ParkingTicket) => void;
}
export const estaMenus = [
  { label: "Check In", link: "/checkIn" },
  { label: "Check Out", link: "/checkOut" },
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
}

interface item {
  label: string;
  value: string;
}

const CheckInForm: React.FC<ParkingFormProps> = () => {
  const [plate, setPlate] = useState("");

  const [color, setColor] = useState("");

  const [services, setServices] = useState<string[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const user = useContext(AuthContext);

  const [parkingLot, setParkingLot] = useState<any>();

  const [parkingLotServices, setParkingLotServices] = useState<item[]>([]); // [ {name: "Lavagem", price: 10}, {name: "Lavagem", price: 10}

  const allServices = {
    wifi: "Wi-fi",
    security: "Segurança",
    coveredParking: "Estacionamento coberto",
    disabledParking: "Estacionamento para deficientes",
    carWash: "Lavagem de carro",
    valetService: "Manobrista",
    electricCarCharging: "Carregamento de carro elétrico",
  };

  const getParkingLotCnpj = async () => {
    const data = await getDocs(parkingLotRef);
    const parkingLot = data.docs.map((doc) => doc.data());
    const parkingLotCnpj = parkingLot.filter(
      (parkingLot) => parkingLot.email === user?.email
    );
    setParkingLot(parkingLotCnpj[0]);
    let services: item[] = [];
    Object.keys(parkingLotCnpj[0].services).forEach((element: any) => {
      if (parkingLotCnpj[0].services[element]) {
        services.push({
          label:
            Object.values(allServices).find((service) => service === element) ||
            "",
          value:
            Object.keys(allServices).find((service) => service === element) ||
            "",
        });
      }
    });
    setParkingLotServices(services);
  };

  useEffect(() => {
    getParkingLotCnpj();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const sanitizedValue = value.slice(0, 7).replace(/[^a-zA-Z0-9]/g, "");
    setPlate(sanitizedValue);
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

    if (await checkIfDuplicatedPlate()) {
      enqueueSnackbar("Placa já cadastrada", { variant: "error" });
      return;
    }

    const formData: ParkingTicket = {
      entryTime: Date.now(),
      plate,
      color,
      services,
      cnpj: parkingLot.cnpj,
      exitTime: 0,
      paymentMethod: "",
      value: 0,
      id: await getLastTicket(),
    };

    await setDoc(doc(fireDb, "tickets", formData.id), formData);

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
            Cnpj: {parkingLot.cnpj}
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

  const getLastTicket = async () => {
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

  const checkIfDuplicatedPlate = async () => {
    const data = await getDocs(ticketsRef);
    let allTickets = data.docs.map((doc) => doc.data());
    let duplicatedPlate = allTickets.filter(
      (ticket) => ticket.plate === plate && ticket.exitTime === 0
    );
    if (duplicatedPlate.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Layout menuItems={estaMenus}>
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
                      checked={false}
                      onChange={handleServiceChange}
                      value={service}
                    />
                  }
                  label={service.label}
                />
              );
            })}
        </Grid>
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
