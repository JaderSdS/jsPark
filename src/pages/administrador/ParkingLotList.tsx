import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import ParkingListComponent from "../../components/ParkingLotListComponent";
import { fireDb } from "../../services/firebaseService";
import { ParkingLotInterface } from "./ParkingLotCreateEdit";

export const adminMenuItems = [
  { label: "Adicionar Estacionamento", link: "/addEstacionamento" },
  { label: "Listar Estacionamentos", link: "/listEstacionamentos" },
];
export default function ParkingLotList() {
  const parkingLotRef = collection(fireDb, "estacionamentos");
  const [parkingLots, setParkingLotList] = useState<ParkingLotInterface[]>([]);

  useEffect(() => {
    const getParkingLots = async () => {
      const data = await getDocs(parkingLotRef);
      setParkingLotList(
        data.docs
          .map((doc) => doc.data() as ParkingLotInterface)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    };
    getParkingLots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => {
    const getParkingLots = async () => {
      const data = await getDocs(parkingLotRef);
      setParkingLotList(
        data.docs
          .map((doc) => doc.data() as ParkingLotInterface)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    };
    getParkingLots();
  };

  return (
    <Layout menuItems={adminMenuItems}>
      <h1>Lista de todos os estacionamentos</h1>
      <ParkingListComponent formData={parkingLots} update={refresh} />
    </Layout>
  );
}
