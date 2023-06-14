/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  SelectChangeEvent,
  InputAdornment,
} from "@mui/material";
import Layout from "../../components/Layout";
import { ParkingTicket, estaMenus } from "./checkIn";
import { parkingLotRef, ticketsRef } from "../../services/firebaseService";
import { getDocs } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { ParkingLotInterface } from "../crud/parkingLot/ParkingLotCreateEdit";
import { AuthContext } from "../../contexts/UserContext";
import {
  AccessTime,
  AccessTimeFilled,
  DirectionsCar,
  SwipeDownAlt,
} from "@mui/icons-material";

const CheckOutForm: React.FC = () => {
  const user = useContext(AuthContext);
  const [plate, setPlate] = useState("");
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [change, setChange] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("dinheiro");
  const [parkingLot, setParkingLot] = useState<ParkingLotInterface>();
  const [ticket, setTicket] = useState<ParkingTicket>();
  const { enqueueSnackbar } = useSnackbar();
  const [exitTime] = useState<Date>(new Date());
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPlate(value);
  };

  //arrow function to find the parking lot
  const findParkingLot = async () => {
    const data = await getDocs(parkingLotRef);
    let thisParkingLot = data.docs
      .map((doc) => doc.data())
      .filter((parkingLot) => {
        return parkingLot.email === user?.email;
      });
    if (thisParkingLot.length > 0) {
      setParkingLot(thisParkingLot[0] as ParkingLotInterface);
    }
  };

  useEffect(() => {
    findParkingLot();
  }, []);

  const calculateAmountPaid = (): number => {
    if (ticket && parkingLot) {
      //hora de entrada
      const entryTime = ticket.entryTime;
      //tempo de permanencia em horas
      const permanenceTime = (exitTime.getTime() - entryTime) / 3600000;

      if (permanenceTime < 1) {
        return parkingLot.prices.hourlyRate;
      }

      if (permanenceTime > 5) {
        //retorna valor da diaria
        debugger;
        return parkingLot.prices.dailyRate;
      }
      //valor a ser pago
      const amountPaid = permanenceTime * parkingLot.prices.hourlyRate;
      return amountPaid;
    }
    return 0;
  };

  // const calculateChange = (amountPaid: number): number => {
  //   // Lógica para calcular o troco com base no valor pago e no total a ser pago

  //   const totalAmount = 0; // Defina o valor total a ser pago

  //   return amountPaid - totalAmount;
  // };

  const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
    debugger;
    setPaymentMethod(event.target.value as string);
  };

  const handleFindTicket = async () => {
    if (plate === "") {
      enqueueSnackbar("Informe a placa do veículo", { variant: "error" });
      return;
    }
    if (plate.length < 7) {
      enqueueSnackbar("Informe uma placa válida", { variant: "error" });
      return;
    }

    const data = await getDocs(ticketsRef);

    let thisTicket = data.docs
      .map((doc) => doc.data())
      .filter((ticket) => {
        return ticket.plate === plate;
      });
    if (thisTicket.length > 0) {
      //trasform DocumentData into ParkingTicket
      setTicket(thisTicket[0] as ParkingTicket);
    }
  };

  const formatDateTime = (date: any) => {
    return date.toISOString().slice(0, 16);
  };

  return (
    <Layout menuItems={estaMenus}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item xs={6} md={12} sm={12}>
          <Typography style={{ marginTop: "16px" }} variant="h4">
            Registrar saída
          </Typography>
        </Grid>
        <Grid item xs={6} md={6} sm={12}>
          <TextField
            sx={{ minWidth: "250px" }}
            name="plate"
            label="Placa"
            value={plate}
            onChange={handleChange}
            inputProps={{
              maxLength: 7,
              minLength: 7,
            }}
            InputProps={{
              startAdornment: <DirectionsCar />,
            }}
            required
          />
        </Grid>
        {ticket && parkingLot ? (
          <>
            <Grid item xs={6} md={6} sm={12}>
              <TextField
                sx={{ minWidth: "250px" }}
                type="datetime-local"
                name="entryTime"
                label="Hora de entrada"
                value={formatDateTime(new Date(ticket.entryTime))}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: <AccessTime />,
                }}
              />
            </Grid>
            <Grid item xs={6} md={6} sm={12}>
              <TextField
                sx={{ minWidth: "250px" }}
                type="datetime-local"
                name="exitTime"
                label="Hora de saída"
                value={formatDateTime(exitTime)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: <AccessTimeFilled />,
                }}
              />
            </Grid>
            <Grid item xs={6} md={6} sm={12}>
              <TextField
                sx={{ minWidth: "250px" }}
                type="text"
                name="totalAmount"
                label="Total"
                value={calculateAmountPaid().toFixed(2)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <strong>R$</strong>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={2} md={2} sm={2}>
              <InputLabel id="payment-method-label">
                Forma de Pagamento
              </InputLabel>
              <Select
                sx={{ minWidth: "250px" }}
                label="Forma de Pagamento"
                value={paymentMethod}
                onChange={(event) => handlePaymentMethodChange(event)}
                required
              >
                <MenuItem value="dinheiro">Dinheiro</MenuItem>
                <MenuItem value="cartao-credito">Cartão de Crédito</MenuItem>
                <MenuItem value="cartao-debito">Cartão de Débito</MenuItem>
                <MenuItem value="pix">PIX</MenuItem>
              </Select>
            </Grid>
            {paymentMethod === "dinheiro" && (
              <>
                <Grid item sx={{ marginTop: 2 }} xs={6} md={6} sm={12}>
                  <TextField
                    sx={{ minWidth: "250px" }}
                    type="number"
                    name="change"
                    label="Valor recebido"
                    value={receivedAmount}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <strong>R$</strong>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(event) => {
                      if (Number(event.target.value) !== 0) {
                        setReceivedAmount(Number(event.target.value));
                        setChange(
                          Number(event.target.value) - calculateAmountPaid()
                        );
                      } else {
                        setReceivedAmount(0);
                        setChange(0);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={6} sm={12}>
                  <SwipeDownAlt sx={{ fontSize: "3em" }} />
                </Grid>
                <Grid item xs={6} md={6} sm={12}>
                  <TextField
                    sx={{ minWidth: "250px" }}
                    type="number"
                    name="change"
                    label="Troco"
                    value={change.toFixed(2)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <strong>R$</strong>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={6} md={6} sm={12}>
              <Button variant="contained" color="primary" onClick={() => {}}>
                Registrar Saída
              </Button>
            </Grid>
          </>
        ) : (
          <Grid item xs={6} md={6} sm={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFindTicket}
            >
              Buscar
            </Button>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default CheckOutForm;
