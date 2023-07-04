import { SnackbarProvider } from "notistack";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginAdm from "./pages/administrador/LoginAdm";
import LoginEsta from "./pages/estacionamento/LoginEsta";
import LoginUsuario from "./pages/userPages/LoginUsuario";
import CheckInForm from "./pages/estacionamento/checkIn";
import CheckOutForm from "./pages/estacionamento/checkOut";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./services/firebaseService";
import NotFound from "./pages/notFound";
import { AuthProvider } from "./contexts/UserContext";
import { CreateUser } from "./pages/userPages/CreateUser";
import { CreateTicket } from "./pages/userPages/CreateTicket";
import { CreateCar } from "./pages/userPages/CreateCar";
import { UserProfile } from "./pages/userPages/UserProfile";
import ParkingForm from "./pages/administrador/ParkingLotCreateEdit";
import ParkingLotList from "./pages/administrador/ParkingLotList";
import HistoricoTicket from "./pages/userPages/TicketsHistoric";

function App() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    return () => {
      onAuthStateChanged(fireAuth, (user) => {
        if (user) {
          setIsLogged(true);
        } else {
          setIsLogged(false);
        }
      });
    };
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <SnackbarProvider
          autoHideDuration={3000}
          preventDuplicate
          hideIconVariant
          dense
          maxSnack={3}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          classes={{ containerAnchorOriginBottomCenter: "zIndex" }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/AdmLoged" element={<ParkingLotList />} />
              <Route
                path="/checkIn"
                element={<CheckInForm onSubmit={() => {}} />}
              />
              <Route path="/checkOut" element={<CheckOutForm />} />

              <Route
                path="/addEstacionamento"
                element={<ParkingForm onSubmit={() => {}} />}
              />
              <Route path="/listEstacionamentos" element={<ParkingLotList />} />

              <Route path="/" element={<LoginAdm />} />
              <Route path="/LoginUsuario" element={<LoginUsuario />} />
              <Route path="/MeuEstacionamento" element={<LoginEsta />} />
              <Route path="*" element={<Navigate to={"/404"} />} />

              <Route path="/404" element={<NotFound />} />
              <Route path="/createUser" element={<CreateUser />} />
              <Route path="/createTicket" element={<CreateTicket />} />
              <Route path="/createTicket/:id" element={<CreateTicket />} />

              <Route path="/createCar" element={<CreateCar />} />
              <Route path="/editCar/:id" element={<CreateCar />} />
              <Route path="/ticketsHistoric" element={<HistoricoTicket />} />
              <Route path="/userProfile" element={<UserProfile />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
