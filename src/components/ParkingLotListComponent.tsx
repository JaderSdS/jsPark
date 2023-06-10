import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  ParkingLotInterface,
  Estado,
} from "../pages/crud/parkingLot/ParkingLotCreateEdit";
import estadosCidades from "../services/estadosCidades.json";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { fireDb } from "../services/firebaseService";
interface ParkingListProps {
  formData: ParkingLotInterface[];
  update: Function;
}
const states: Estado[] = estadosCidades.estados;

const ParkingListComponent: React.FC<ParkingListProps> = ({
  formData,
  update,
}) => {
  const parkingLotRef = collection(fireDb, "estacionamentos");
  const deleteParkingLot = async (id: number) => {
    await deleteDoc(doc(parkingLotRef, id.toString()));
    update();
  };
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
            <TableCell>Nome</TableCell>
            <TableCell>CNPJ</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Endereço</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Cidade</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formData.map((parkingLot, index) => (
            <TableRow key={index}>
              <TableCell>{parkingLot.name}</TableCell>
              <TableCell>{parkingLot.cnpj}</TableCell>
              <TableCell>{parkingLot.email}</TableCell>
              <TableCell>{parkingLot.address}</TableCell>
              <TableCell>
                {states.find((state) => state.id === parkingLot.state)?.nome}
              </TableCell>
              <TableCell>
                {" "}
                {
                  states
                    .find((state) => state.id === parkingLot.state)
                    ?.cidades.find((cidade) => cidade.id === parkingLot.city)
                    ?.nome
                }
              </TableCell>
              {/* botão icone de editar e excluir */}
              <TableCell
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "60%",
                }}
              >
                <Button>
                  <EditIcon />
                </Button>
                <Button onClick={() => deleteParkingLot(parkingLot.cnpj)}>
                  <DeleteForeverIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ParkingListComponent;
