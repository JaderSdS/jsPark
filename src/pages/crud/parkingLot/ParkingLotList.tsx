import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDb } from "../../../services/firebaseService";
import { ParkingLotInterface } from "./ParkingLotCreateEdit";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ParkingDetails from "./ParkingLotDetails";

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
    <div>
      <h1>Lista de todos os estacionamentos</h1>
      <ParkingDetails formData={parkingLots} />
    </div>
  );
}
