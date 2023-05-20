import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  InputLabel,
} from "@mui/material";

interface ParkingFormProps {
  onSubmit: (formData: ParkingFormData) => void;
}

interface ParkingFormData {
  plate: string;
  color: string;
  paymentMethod: string;
  services: string[];
}

const CheckInForm: React.FC<ParkingFormProps> = ({ onSubmit }) => {
  const [plate, setPlate] = useState("");
  const [color, setColor] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [services, setServices] = useState<string[]>([]);

  const handlePlateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // Limitar a 7 caracteres e permitir apenas números e letras
    const sanitizedValue = value.slice(0, 7).replace(/[^a-zA-Z0-9]/g, "");
    setPlate(sanitizedValue);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setPaymentMethod(event.target.value as string);
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formData: ParkingFormData = {
      plate,
      color,
      paymentMethod,
      services,
    };

    // Aqui você pode fazer qualquer ação necessária com o objeto de formData, como enviá-lo para o backend ou manipulá-lo de acordo com suas necessidades.
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Placa"
            value={plate}
            onChange={handlePlateChange}
            fullWidth
            required
            inputProps={{ maxLength: 7 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Cor"
            value={color}
            onChange={handleColorChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox value="valet" onChange={handleServiceChange} />}
            label="Valet"
          />
          <FormControlLabel
            control={
              <Checkbox value="lavagem" onChange={handleServiceChange} />
            }
            label="Lavagem"
          />
          <FormControlLabel
            control={<Checkbox value="wi-fi" onChange={handleServiceChange} />}
            label="Wi-Fi"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Enviar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CheckInForm;
