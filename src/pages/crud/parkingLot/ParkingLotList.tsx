import React, { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { fireDb } from "../../../services/firebaseService";

export default function ParkingLotList() {
  useEffect(() => {
    const setDocs = () => {
      console.log("Setting docs...");
      seetDoc();
    };

    return setDocs;
  }, []);

  const seetDoc = async () => {
    await setDoc(doc(fireDb, "estacionamentos", 'AquiDeveSerVariavel'), {
      name: "Los Angeles",
      state: "CA",
      country: "USA",
    });
  };

  // Add a new document in collection "cities"

  return (
    <div>
      <h1>Lista de todos os estacionamentos</h1>
    </div>
  );
}
