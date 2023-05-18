import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import estadosCidades from "./../../../services/estadosCidades.json";
interface ParkingFormProps {
  onSubmit: (formData: FormData) => void;
}
interface City {
  id: number;
  nome: string;
}

interface State {
  id: number;
  nome: string;
  cidades: City[];
}

export interface FormData {
  name: string;
  cnpj: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  openingHours: {
    [day: string]: {
      openingTime: string;
      closingTime: string;
    };
  };
  services: {
    wifi: boolean;
    security: boolean;
    coveredParking: boolean;
    disabledParking: boolean;
    carWash: boolean;
    valetService: boolean;
    electricCarCharging: boolean;
  };
  prices: {
    hourlyRate: string;
    dailyRate: string;
    monthlyPackages: boolean;
  };
  policies: {
    cancellation: string;
    refund: string;
    other: string;
  };
  additionalInfo: {
    description: string;
    instructions: string;
  };
}

const states: State[] = estadosCidades.estados;

const ParkingForm: React.FC<ParkingFormProps> = () => {
  const emptyData = {
    name: "",
    cnpj: 0,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    openingHours: {},
    services: {
      wifi: false,
      security: false,
      coveredParking: false,
      disabledParking: false,
      carWash: false,
      valetService: false,
      electricCarCharging: false,
    },
    prices: {
      hourlyRate: "",
      dailyRate: "",
      monthlyPackages: false,
    },
    policies: {
      cancellation: "",
      refund: "",
      other: "",
    },
    additionalInfo: {
      description: "",
      instructions: "",
    },
  };
  const [formData, setFormData] = useState<FormData>(emptyData);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleStateChange = (event: any) => {
    debugger;
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

  const handleInputChange = (e: any) => {
    debugger;
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      services: {
        ...prevData.services,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        alignItems={"flex-end"}
        justifyContent={"flex-start"}
        spacing={3}
      >
        <Grid item xs={12}>
          <h2>Formulário de Cadastro de Estacionamento</h2>
        </Grid>

        <Grid item xs={12}>
          <h3>Informações Gerais:</h3>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            name="name"
            label="Nome do Estacionamento"
            value={formData.name}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            name="cnpj"
            label="CNPJ"
            value={formData.cnpj}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            name="email"
            label="E-mail"
            value={formData.email}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            name="address"
            label="Endereço"
            value={formData.address}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            name="phone"
            label="Telefone"
            value={formData.phone}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            name="zipCode"
            label="CEP"
            value={formData.zipCode}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={3}>
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
        <Grid item xs={12} sm={3}>
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
        <Grid item xs={12}>
          <h3>Horário de Funcionamento:</h3>
        </Grid>
        {[
          "Segunda-feira",
          "Terça-feira",
          "Quarta-feira",
          "Quinta-feira",
          "Sexta-feira",
          "Sábado",
          "Domingo",
        ].map((day) => (
          <React.Fragment key={day}>
            <Grid item xs={12} sm={1}>
              <h4>{day}</h4>
            </Grid>
            <Grid item xs={6} sm={1}>
              <TextField
                name={`openingHours.${day}.openingTime`}
                label="Abertura"
                value={formData.openingHours[day]?.openingTime || ""}
                onChange={(event) => handleInputChange(event)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={1}>
              <TextField
                name={`openingHours.${day}.closingTime`}
                label="Fechamento"
                value={formData.openingHours[day]?.closingTime || ""}
                onChange={(event) => handleInputChange(event)}
                fullWidth
              />
            </Grid>
          </React.Fragment>
        ))}

        <Grid item xs={12}>
          <h3>Serviços Disponíveis:</h3>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="wifi"
                checked={formData.services.wifi}
                onChange={handleCheckboxChange}
              />
            }
            label="Wi-Fi"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="security"
                checked={formData.services.security}
                onChange={handleCheckboxChange}
              />
            }
            label="Segurança 24 horas"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="coveredParking"
                checked={formData.services.coveredParking}
                onChange={handleCheckboxChange}
              />
            }
            label="Estacionamento Coberto"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="disabledParking"
                checked={formData.services.disabledParking}
                onChange={handleCheckboxChange}
              />
            }
            label="Estacionamento para Deficientes"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="carWash"
                checked={formData.services.carWash}
                onChange={handleCheckboxChange}
              />
            }
            label="Lavagem"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="valet"
                checked={formData.services.valetService}
                onChange={handleCheckboxChange}
              />
            }
            label="Manobrista"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="electricCarCharging"
                checked={formData.services.electricCarCharging}
                onChange={handleCheckboxChange}
              />
            }
            label="Carregador para carrro elétrico"
          />
        </Grid>

        <Grid item xs={12}>
          <h3>Preços:</h3>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="hourlyRate"
            label="Tarifa por hora"
            value={formData.prices.hourlyRate}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="dailyRate"
            label="Tarifa Diária"
            value={formData.prices.dailyRate}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="monthlyPackages"
                checked={formData.prices.monthlyPackages}
                onChange={handleCheckboxChange}
              />
            }
            label="Pacotes mensais disponíveis"
          />
        </Grid>

        <Grid item xs={12}>
          <h3>Políticas:</h3>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="cancellation"
            label="Política de cancelamento"
            value={formData.policies.cancellation}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="refund"
            label="Política de reembolso"
            value={formData.policies.refund}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="other"
            label="Outras políticas"
            value={formData.policies.other}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <h3>Informações Adicionais:</h3>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="description"
            label="Descrição do Estacionamento"
            multiline
            rows={4}
            value={formData.additionalInfo.description}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="instructions"
            label="Instruções para os Clientes"
            multiline
            rows={4}
            value={formData.additionalInfo.instructions}
            onChange={(event) => handleInputChange(event)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <Button variant="contained" color="primary" type="submit">
            Enviar
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="secondary"
            type="reset"
            onClick={() => setFormData(emptyData)}
          >
            Limpar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ParkingForm;
