import emailjs from "@emailjs/browser";
import { ParkingLotInterface } from "../pages/administrador/ParkingLotCreateEdit";
import { getDocs } from "firebase/firestore";
import { usersRef } from "./firebaseService";

export const sendEmail = async (
  plate: string,
  parkingLot: ParkingLotInterface,
  carOwner: string,
  state: string,
  city: string
) => {
  debugger;
  const message =
    "O veículo de placa " +
    plate +
    " entrou no estacionamento " +
    parkingLot.name +
    " às " +
    new Date().toLocaleString() +
    " . " +
    "Segue informações do estacionamento: " +
    " Endereço: " +
    parkingLot.address +
    " Cidade: " +
    city +
    " Estado: " +
    state +
    " Telefone: " +
    parkingLot.phone +
    " Email: " +
    parkingLot.email;

  const USER = await getUserNameAndMail(carOwner);
  emailjs
    .send(
      "ticketsService",
      "avisoDeEntrada",
      {
        message: message,
        plate: plate,
        name: parkingLot.name,
        userMail: "jadersilvadasilva@gmail.com",
        userName: USER.name,
      },
      "Sb4_FHfvPxFg7r5ta"
    )
    .then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
};

const getUserNameAndMail = async (userId: string) => {
  const data = await getDocs(usersRef);
  let allUsers = data.docs.map((doc) => doc.data());
  let user = allUsers.find((user) => user.id === userId);
  if (user) {
    return { name: user.name, mail: user.email };
  } else {
    return { name: "Usuário", mail: "email" };
  }
};
