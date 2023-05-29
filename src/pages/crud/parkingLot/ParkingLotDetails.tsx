import React from "react";
import { Grid, Typography, Box } from "@mui/material";

interface ParkingDetailsProps {
  formData: {
    name: string;
    address: string;
    capacity: string;
    price: string;
    policies: {
      cancellation: string;
      refund: string;
      other: string;
    };
    additionalInfo: {
      description: string;
      instructions: string;
    };
  };
}

const ParkingDetails: React.FC<ParkingDetailsProps> = ({ formData }) => {
  function ordenarDiasDaSemana(diasDaSemana: any[]) {
    const ordemDosDias = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
    ];

    diasDaSemana.sort((dia1: string, dia2: string) => {
      const indiceDia1 = ordemDosDias.indexOf(dia1.toLowerCase());
      const indiceDia2 = ordemDosDias.indexOf(dia2.toLowerCase());

      return indiceDia1 - indiceDia2;
    });

    return diasDaSemana;
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Detalhes do Estacionamento
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box bgcolor="#00ccbe" p={2} color="#ffffff">
          <Typography variant="h6" gutterBottom>
            Informações Gerais
          </Typography>
          <Typography variant="body1" gutterBottom>
            Nome: {formData.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Endereço: {formData.address}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Capacidade: {formData.capacity}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Preço por Hora: {formData.price}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box bgcolor="#09a6a3" p={2} color="#ffffff">
          <Typography variant="h6" gutterBottom>
            Políticas
          </Typography>
          <Typography variant="body1" gutterBottom>
            Política de Cancelamento: {formData.policies.cancellation}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Política de Reembolso: {formData.policies.refund}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Outras Políticas: {formData.policies.other}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box bgcolor="#9dbfaf" p={2} color="#ffffff">
          <Typography variant="h6" gutterBottom>
            Informações Adicionais
          </Typography>
          <Typography variant="body1" gutterBottom>
            Descrição do Estacionamento: {formData.additionalInfo.description}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Instruções para os Clientes: {formData.additionalInfo.instructions}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ParkingDetails;
