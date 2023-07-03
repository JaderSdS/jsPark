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
  Typography,
} from "@mui/material";
import { setDoc, doc } from "firebase/firestore";
import { adminMenuItems } from "./ParkingLotList";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import estadosCidades from "../../services/estadosCidades.json";
import Layout from "../../components/Layout";
import { fireDb } from "../../services/firebaseService";
interface ParkingFormProps {
  onSubmit: (formData: ParkingLotInterface) => void;
}
export interface City {
  id: number;
  nome: string;
}

export interface Estado {
  id: number;
  nome: string;
  cidades: City[];
}

export interface ParkingLotInterface {
  name: string;
  cnpj: number;
  address: string;
  city: number;
  state: number;
  zipCode: string;
  phone: string;
  email: string;
  openingHours: Record<string, { openingTime: string; closingTime: string }>;
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
    hourlyRate: number;
    dailyRate: number;
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

export const states: Estado[] = estadosCidades.estados;

const ParkingForm: React.FC<ParkingFormProps> = () => {
  const emptyData = {
    name: "",
    cnpj: 0,
    address: "",
    city: 0,
    state: 0,
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
      hourlyRate: 0,
      dailyRate: 0,
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
  const [formData, setFormData] = useState<ParkingLotInterface>(emptyData);
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<Estado | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleStateChange = (event: any) => {
    const stateId = event.target.value as number;
    const state = states.find((state) => stateId === state.id);
    setSelectedState(state || null);
    setSelectedCity(null);
    setFormData((prevData) => ({
      ...prevData,
      state: stateId,
    }));
  };

  const handleCityChange = (event: any) => {
    const cityId = event.target.value as number;
    const city = selectedState?.cidades.find((city) => cityId === city.id);
    setSelectedCity(city || null);
    setFormData((prevData) => ({
      ...prevData,
      city: cityId,
    }));
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOpeningHourChange = (e: any) => {
    const { name, value } = e.target;
    const formattedInput = value.replace(/[^\d:]/g, "");

    let formatedValue = value;
    if (/^\d{2}$/.test(formattedInput)) {
      formatedValue = formattedInput + ":";
    }
    setFormData((prevData) => ({
      ...prevData,
      openingHours: {
        ...prevData.openingHours,
        [name.split(".")[0]]: {
          ...prevData.openingHours[name.split(".")[0]],
          [name.split(".")[1]]: formatedValue,
        },
      },
    }));
  };

  const handlePricesChanged = (e: any) => {
    const { name, value, checked } = e.target;
    const nameRegex = new RegExp(name);
    setFormData((prevData) => ({
      ...prevData,
      prices: {
        ...prevData.prices,
        [name]: nameRegex.test("monthlyPackages") ? checked : parseInt(value),
      },
    }));
  };

  const handlePoliciesChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      policies: {
        ...prevData.policies,
        [name]: value,
      },
    }));
  };

  const handleAdditionalInfoChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      additionalInfo: {
        ...prevData.additionalInfo,
        [name]: value,
      },
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await setDoc(
      doc(fireDb, "estacionamentos", formData.cnpj.toString()),
      formData
    )
      .then(() => {
        enqueueSnackbar("Estacionamento cadastrado com sucesso");
        navigate("/listEstacionamentos");
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao cadastrar estacionamento");
      });
  };

  return (
    <Layout menuItems={adminMenuItems}>
      <form onSubmit={handleSubmit}>
        <Grid textAlign="center" container alignItems={"flex-end"} spacing={3}>
          <Grid item xs={12}>
            <Typography style={{ marginTop: "16px" }} variant="h4">
              Formulário de Cadastro de Estacionamento
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <h3>Informações Gerais:</h3>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              name="name"
              label="Nome do Estacionamento"
              value={formData.name}
              onChange={(event) => handleInputChange(event)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              inputProps={{ maxLength: 14 }}
              name="cnpj"
              label="CNPJ"
              value={formData.cnpj}
              onChange={(event) => handleInputChange(event)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              name="email"
              label="E-mail"
              value={formData.email}
              onChange={(event) => handleInputChange(event)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              name="address"
              label="Endereço"
              value={formData.address}
              onChange={(event) => handleInputChange(event)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              inputProps={{ maxLength: 11 }}
              name="phone"
              label="Telefone"
              value={formData.phone}
              onChange={(event) => handleInputChange(event)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              name="zipCode"
              label="CEP"
              inputProps={{ maxLength: 8 }}
              value={formData.zipCode}
              onChange={(event) => handleInputChange(event)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
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
          <Grid item xs={12} sm={12}>
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
              <Grid item xs={12} sm={12}>
                <h4>{day}</h4>
              </Grid>
              <Grid item xs={6} sm={12}>
                <TextField
                  name={`${day}.openingTime`}
                  label="Abertura"
                  value={formData.openingHours[day]?.openingTime || ""}
                  onChange={(event) => {
                    handleOpeningHourChange(event);
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={12}>
                <TextField
                  inputProps={{ maxLength: 5 }}
                  name={`${day}.closingTime`}
                  label="Fechamento"
                  value={formData.openingHours[day]?.closingTime || ""}
                  onChange={(event) => {
                    handleOpeningHourChange(event);
                  }}
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
              onChange={(event) => handlePricesChanged(event)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="dailyRate"
              label="Tarifa Diária"
              value={formData.prices.dailyRate}
              onChange={(event) => handlePricesChanged(event)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="monthlyPackages"
                  checked={formData.prices.monthlyPackages}
                  onChange={handlePricesChanged}
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
              onChange={(event) => handlePoliciesChange(event)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="refund"
              label="Política de reembolso"
              value={formData.policies.refund}
              onChange={(event) => handlePoliciesChange(event)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="other"
              label="Outras políticas"
              value={formData.policies.other}
              onChange={(event) => handlePoliciesChange(event)}
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
              onChange={(event) => handleAdditionalInfoChange(event)}
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
              onChange={(event) => handleAdditionalInfoChange(event)}
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
    </Layout>
  );
};

export default ParkingForm;
