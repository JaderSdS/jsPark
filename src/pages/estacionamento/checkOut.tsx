import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
} from '@mui/material';

interface Vehicle {
  plate: string;
  exitTime: Date | null;
}

interface Ticket {
  plate: string;
  entryTime: Date;
  exitTime: Date | null;
  amountPaid: number;
  cnpj: string;
  address: string;
  ticketId: number;
  paymentMethod: string;
  duration: string;
}

interface ParkingExitProps {
  updateTicket: (plate: string, exitTime: Date, amountPaid: number) => void;
}

const CheckOutForm: React.FC<ParkingExitProps> = ({ updateTicket }) => {
  const [vehicle, setVehicle] = useState<Vehicle>({
    plate: '',
    exitTime: null,
  });
  const [change, setChange] = useState<number | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setVehicle((prevVehicle) => ({
      ...prevVehicle,
      [name]: value,
    }));
  };

  const handleExit = () => {
    const { plate, exitTime } = vehicle;

    // Verificar se todos os campos estão preenchidos
    if (plate && exitTime) {
      const amountPaid = calculateAmountPaid(plate, exitTime);
      const changeAmount = calculateChange(amountPaid);

      updateTicket(plate, exitTime, amountPaid);
      setChange(changeAmount);
    }
  };

  const calculateAmountPaid = (plate: string, exitTime: Date): number => {
    // Lógica para calcular o valor a ser pago com base na placa e no horário de saída
    // Substitua esta lógica pelo cálculo correto de acordo com as regras do estacionamento

    return 0; // Retorna 0 como exemplo
  };

  const calculateChange = (amountPaid: number): number => {
    // Lógica para calcular o troco com base no valor pago e no total a ser pago

    const totalAmount = 0; // Defina o valor total a ser pago

    return amountPaid - totalAmount;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          name="plate"
          label="Placa"
          value={vehicle.plate}
          onChange={handleChange}
          inputProps={{
            maxLength: 7,
            pattern: '[A-Za-z0-9]{0,7}',
          }}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="datetime-local"
          name="exitTime"
          label="Hora de Saída"
          value={vehicle.exitTime || ''}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleExit}>
          Registrar Saída
        </Button>
      </Grid>
      {change !== null && (
        <Grid item xs={12}>
          <strong>Troco: R$ {change.toFixed(2)}</strong>
        </Grid>
      )}
    </Grid>
  );
};

export default CheckOutForm;
