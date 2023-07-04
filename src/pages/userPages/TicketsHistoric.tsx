import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getDocs } from "firebase/firestore";
import { parkingLotRef, ticketsRef } from "../../services/firebaseService";
import { ParkingTicket } from "../estacionamento/checkIn";
import BlueCard from "../../components/BlueCard";
import { AuthContext } from "../../contexts/UserContext";
import { getUserCars } from "./UserProfile";
import { CarInterface } from "./CreateCar";
import { Typography } from "@mui/material";
import { ParkingLotInterface } from "../administrador/ParkingLotCreateEdit";

export const userMenus = [
  { label: "Gerar ticket", link: "/createTicket" },
  { label: "Histórico", link: "/HistoricoTicket" },
  { label: "Perfil", link: "/editUser" },
];

const HistoricoTicket: React.FC = () => {
  const contextUser = useContext(AuthContext);
  const [userCars, setUserCars] = useState<CarInterface[]>();
  const [tickets, setTicket] = useState<ParkingTicket[]>();
  const [parkingLot, setParkingLot] = useState<ParkingLotInterface[]>();

  const GetUserCars = async () => {
    const cars = await getUserCars(contextUser?.uid || "");
    let ticketsFromCar = cars.map((car) => {
      return GetTickets(car.plate);
    });
    setUserCars(cars as CarInterface[]);
    setTicket((await Promise.all(ticketsFromCar)).flat() as ParkingTicket[]);
  };

  const GetParkingLot = async () => {
    const data = await getDocs(parkingLotRef);
    let thisParkingLot = data.docs.map((doc) => doc.data());
    if (thisParkingLot.length > 0) {
      setParkingLot(thisParkingLot as ParkingLotInterface[]);
    }
  };

  const GetTickets = async (plate: string) => {
    const data = await getDocs(ticketsRef);
    let t = data.docs.map((e) => {
      return e.data();
    });
    return t.filter((e) => e.plate == plate);
  };

  const GetNamePark = (cnpj: number) => {
    let value = parkingLot?.filter((x) => x.cnpj == cnpj)[0];
    if (value) return value.name;
    else return "Não encontrado";
  };

  const GetDateByTimestamp = (timestamp: number) => {
    const today = new Date(timestamp);
    let yyyy = today.getFullYear();
    let mm = (today.getMonth() + 1 < 10 ? "0" : "") + (today.getMonth() + 1);
    let dd = (today.getDate() < 10 ? "0" : "") + today.getDate();

    const formattedToday = dd + "/" + mm + "/" + yyyy;
    return formattedToday;
  };

  useEffect(() => {
    GetParkingLot();
    GetUserCars();
  }, []);

  return (
    <Layout menuItems={userMenus}>
      <Typography style={{ marginTop: "16px" }} variant="h4">
        Meus histórico de tickets
      </Typography>
      {tickets &&
        tickets.length > 0 &&
        tickets.map((e: any) => {
          let c = [
            { key: "Placa", value: e["plate"] },
            {
              key: "Estacionamento",
              value: GetNamePark(Number(e.cnpj)) as string,
            },
            { key: "Entrada", value: GetDateByTimestamp(e["entryTime"]) },
            { key: "Saída", value: GetDateByTimestamp(e["exitTime"]) },
            { key: "Ticket", value: `#${e["id"]}` },
            { key: "Valor pago", value: `R$ ${e["value"] || "0"}` },
            {
              key: "Estado",
              value: e["status"] === "Open" ? "Aberto" : "Fechado",
            },
          ];
          return (
            <span>
              <BlueCard record={c} icon="Open" />
            </span>
          );
        })}
    </Layout>
  );
};

export default HistoricoTicket;
