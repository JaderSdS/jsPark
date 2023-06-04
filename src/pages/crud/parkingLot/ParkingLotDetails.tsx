import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ParkingLotInterface } from "./ParkingLotCreateEdit";

interface ParkingDetailsProps {
  formData: ParkingLotInterface[];
}

const ParkingListComponent: React.FC<ParkingDetailsProps> = ({ formData }) => {
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
          {formData.map((parkingLot, index) => (
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
  );
};

export default ParkingListComponent;
