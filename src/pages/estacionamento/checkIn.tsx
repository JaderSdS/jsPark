import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
} from "@mui/material";
import Layout from "../../components/Layout";
import { setDoc, doc, collection, getDocs } from "firebase/firestore";
import { fireDb } from "../../services/firebaseService";
import { AuthContext } from "../../contexts/UserContext";
import { useSnackbar } from "notistack";
import QRCode from "react-qr-code";
import { Print } from "@mui/icons-material";

interface ParkingFormProps {
  onSubmit: (formData: ParkingFormData) => void;
}

interface ParkingFormData {
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

  const [paymentMethod, setPaymentMethod] = useState("");

  const [services, setServices] = useState<string[]>([]);

  const ticketsRef = collection(fireDb, "tickets");

  const { enqueueSnackbar } = useSnackbar();

  const parkingLotRef = collection(fireDb, "estacionamentos");

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

  // const handlePaymentMethodChange = (
  //   event: React.ChangeEvent<{ value: unknown }>
  // ) => {
  //   setPaymentMethod(event.target.value as string);
  // };

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

    const formData: ParkingFormData = {
      entryTime: Date.now(),
      plate,
      color,
      services,
      cnpj: parkingLot.cnpj,
      exitTime: 0,
      paymentMethod: "",
      value: 0,
    };

    await setDoc(doc(fireDb, "tickets", await getLastTicket()), formData);

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
      </>
    );
    enqueueSnackbar(
      <Grid container spacing={2}>
        <Grid item style={style} sm={12} md={12}>
          Ticket gerado com sucesso
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
      { action }
    );

    setColor("");
    setPlate("");
    setPaymentMethod("");
  };

  const getLastTicket = async () => {
    const data = await getDocs(ticketsRef);

    let a = data.docs.map((doc) => doc.id);

    var bigger = Number(a[0]);

    for (var i = 1; i < a.length; i++) {
      var actualNumber = Number(a[i]);

      if (actualNumber > bigger) {
        bigger = actualNumber;
      }
    }
    bigger += 1;
    return bigger.toString();
  };

  const menuItens = [
    { label: "Entrar", link: "checkOut" },
    { label: "Histórico", link: "checkOut" },
    { label: "Perfil", link: "checkOut" },
  ];

  //   const tk = {
  //     id: 35,
  //     cnpj: 12345678911,
  //     horaEntrada: Date.now(),
  //     horaSaida: null,
  //     placa: "abc-1234",
  //     servicoAdicional: ["Lavagem"],
  //   };
  //  <QRCode value={JSON.stringify(tk)} size={150} />

  return (
    <Layout menuItems={menuItens}>
      <h2>Registrar entrada</h2>
      <Grid container spacing={2}>
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
        {/* <Grid item xs={12} md={6} sm={12}>
          <InputLabel id="payment-method-label">Forma de Pagamento</InputLabel>
          <Select
            label="Forma de Pagamento"
            value={paymentMethod}
            onChange={() => handlePaymentMethodChange}
            fullWidth
            required
          >
            <MenuItem value="dinheiro">Dinheiro</MenuItem>
            <MenuItem value="cartao-credito">Cartão de Crédito</MenuItem>
            <MenuItem value="cartao-debito">Cartão de Débito</MenuItem>
            <MenuItem value="pix">PIX</MenuItem>
          </Select>
        </Grid> */}
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
