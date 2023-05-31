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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>CNPJ</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Zip Code</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Opening Hours</TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Prices</TableCell>
              <TableCell>Policies</TableCell>
              <TableCell>Additional Info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parkingLots.map((parkingLot, index) => (
              <TableRow key={index}>
                <TableCell>{parkingLot.name}</TableCell>
                <TableCell>{parkingLot.cnpj}</TableCell>
                <TableCell>{parkingLot.address}</TableCell>
                <TableCell>{parkingLot.city}</TableCell>
                <TableCell>{parkingLot.state}</TableCell>
                <TableCell>{parkingLot.zipCode}</TableCell>
                <TableCell>{parkingLot.phone}</TableCell>
                <TableCell>{parkingLot.email}</TableCell>
                <TableCell>
                  <ul>
                    {Object.entries(parkingLot.openingHours).map(
                      ([day, { openingTime, closingTime }]) => (
                        <li key={day}>
                          {day}: {openingTime} - {closingTime}
                        </li>
                      )
                    )}
                  </ul>
                </TableCell>
                <TableCell>
                  <ul>
                    <li>
                      Wifi:{" "}
                      {parkingLot.services.wifi ? "Available" : "Not available"}
                    </li>
                    <li>
                      Security:{" "}
                      {parkingLot.services.security
                        ? "Available"
                        : "Not available"}
                    </li>
                    <li>
                      Covered Parking:{" "}
                      {parkingLot.services.coveredParking
                        ? "Available"
                        : "Not available"}
                    </li>
                    <li>
                      Disabled Parking:{" "}
                      {parkingLot.services.disabledParking
                        ? "Available"
                        : "Not available"}
                    </li>
                    <li>
                      Car Wash:{" "}
                      {parkingLot.services.carWash
                        ? "Available"
                        : "Not available"}
                    </li>
                    <li>
                      Valet Service:{" "}
                      {parkingLot.services.valetService
                        ? "Available"
                        : "Not available"}
                    </li>
                    <li>
                      Electric Car Charging:{" "}
                      {parkingLot.services.electricCarCharging
                        ? "Available"
                        : "Not available"}
                    </li>
                  </ul>
                </TableCell>
                <TableCell>
                  <ul>
                    <li>Hourly Rate: {parkingLot.prices.hourlyRate}</li>
                    <li>Daily Rate: {parkingLot.prices.dailyRate}</li>
                    <li>
                      Monthly Packages:{" "}
                      {parkingLot.prices.monthlyPackages
                        ? "Available"
                        : "Not available"}
                    </li>
                  </ul>
                </TableCell>
                <TableCell>
                  <ul>
                    <li>Cancellation: {parkingLot.policies.cancellation}</li>
                    <li>Refund: {parkingLot.policies.refund}</li>
                    <li>Other: {parkingLot.policies.other}</li>
                  </ul>
                </TableCell>
                <TableCell>
                  <Typography>
                    Description: {parkingLot.additionalInfo.description}
                  </Typography>
                  <Typography>
                    Instructions: {parkingLot.additionalInfo.instructions}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
