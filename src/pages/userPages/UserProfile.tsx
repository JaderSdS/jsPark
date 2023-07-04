/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Grid, Typography } from "@mui/material";
import Layout from "../../components/layout";
import { userMenus } from "./CreateUser";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { carsRef } from "../../services/firebaseService";
import { deleteDoc, doc, getDocs } from "firebase/firestore";
import { CarInterface } from "./CreateCar";
import {
  AddBox,
  DeleteForever,
  Edit,
  NotificationsActive,
} from "@mui/icons-material";

export const getUserCars = async (userId: string) => {
  const userCars = await getDocs(carsRef);
  return userCars.docs
    .map((doc) => doc.data())
    .filter((car) => car.owner === userId);
};

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const contextUser = useContext(AuthContext);
  const [cars, setCars] = useState<CarInterface[]>([]);

  useEffect(() => {
    const getCars = async () => {
      const cars = await getUserCars(contextUser?.uid || "");
      setCars(cars as CarInterface[]);
    };
    getCars();
  }, []);

  const excludeCar = async (carId: string) => {
    await await deleteDoc(doc(carsRef, carId));
    const cars = await getUserCars(contextUser?.uid || "");
    setCars(cars as CarInterface[]);
  };

  return (
    <Layout menuItems={userMenus}>
      <Grid
        container
        sx={{ margin: "16px" }}
        direction="column"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item>
          <Typography variant="h4">Meus carros</Typography>
        </Grid>
        <Grid item xs={6} md={12} sm={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/createCar")}
          >
            Cadastrar carro <AddBox />
          </Button>
        </Grid>
      </Grid>

      {cars.length > 0 &&
        cars.map((car) => (
          <Grid
            container
            xs={12}
            md={12}
            sm={12}
            sx={{
              borderRadius: "10px",
              backgroundColor: "#1976d2",
              margin: "16px",
              padding: "16px",
            }}
          >
            <Grid item xs={6} md={6} sm={6}>
              <Typography variant="h5">
                <strong>Carro:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Typography variant="h5">
                {car.name}
                {car.alert ? (
                  <NotificationsActive fontSize="small" />
                ) : (
                  <div style={{ width: "20px" }}></div>
                )}
              </Typography>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Typography variant="h5">
                <strong>Placa:</strong>
              </Typography>
            </Grid>

            <Grid item xs={6} md={6} sm={6}>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {car.plate}
              </Typography>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Typography variant="h5">
                <strong>Modelo:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Typography variant="h5">{car.model}</Typography>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Typography variant="h5">
                <strong>Cor:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Typography variant="h5">{car.color}</Typography>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Typography variant="h5">
                <strong>Ano:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Typography variant="h5">{car.year}</Typography>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => excludeCar(car.id)}
              >
                <DeleteForever />
              </Button>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Button
                color="inherit"
                variant="contained"
                onClick={() => navigate(`/editCar/${car.id}`)}
                sx={{ justifySelf: "flex-end", padding: "-15px" }}
              >
                <Edit fontSize="small" />
              </Button>
            </Grid>
          </Grid>
        ))}
    </Layout>
  );
};
