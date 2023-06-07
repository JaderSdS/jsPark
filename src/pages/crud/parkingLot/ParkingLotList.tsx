import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDb } from "../../../services/firebaseService";
import { ParkingLotInterface } from "./ParkingLotCreateEdit";
import ParkingListComponent from "./ParkingLotDetails";
import Layout from "../../../components/layout";

export const adminMenuItems = [
  { label: "Adicionar Estacionamento", link: "/addEstacionamento" },
  { label: "Listar Estacionamentos", link: "/listEstacionamentos" },
  { label: "Check In", link: "/checkIn" },
  { label: "Check Out", link: "/checkOut" },
];
export default function ParkingLotList() {
  const parkingLotRef = collection(fireDb, "estacionamentos");
  const [parkingLots, setParkingLotList] = useState<ParkingLotInterface[]>([]);

  useEffect(() => {
    const getParkingLots = async () => {
      const data = await getDocs(parkingLotRef);
      setParkingLotList(
        data.docs.map((doc) => doc.data() as ParkingLotInterface)
      );
    };
    getParkingLots();
  }, []);

  return (
    <Layout menuItems={adminMenuItems}>
      <h1>Lista de todos os estacionamentos</h1>
      <ParkingListComponent formData={parkingLots} />
    </Layout>
  );
}
