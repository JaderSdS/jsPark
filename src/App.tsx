import { SnackbarProvider } from "notistack";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginAdm from "./pages/login/LoginAdm";
import LoginEsta from "./pages/login/LoginEsta";
import LoginUsu from "./pages/login/LoginUsu";
import ParkingLotList from "./pages/crud/parkingLot/ParkingLotList";
import ParkingForm from "./pages/crud/parkingLot/ParkingLotCreateEdit";
import CheckInForm from "./pages/estacionamento/checkIn";
import CheckOutForm from "./pages/estacionamento/checkOut";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./services/firebaseService";
import NotFound from "./pages/notFound";
import { AuthProvider } from "./contexts/UserContext";

function App() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    return () => {
      onAuthStateChanged(fireAuth, (user) => {
        debugger;
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
          preventDuplicate
          hideIconVariant
          dense
          maxSnack={4}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          classes={{ containerAnchorOriginBottomCenter: "zIndex" }}
        >
          <BrowserRouter>
            {/* {isLogged ? ( */}
            <Routes>
              <Route path="/AdmLoged" element={<ParkingLotList />} />
              <Route path="/EstaLoged" element={<LoginUsu />} />
              <Route path="/UsuLoged" element={<LoginUsu />} />
              <Route
                path="/checkIn"
                element={<CheckInForm onSubmit={() => {}} />}
              />
              <Route
                path="/checkOut"
                element={<CheckOutForm updateTicket={() => {}} />}
              />

              <Route
                path="/addEstacionamento"
                element={<ParkingForm onSubmit={() => {}} />}
              />
              <Route path="/listEstacionamentos" element={<ParkingLotList />} />
              <Route path="/MeuEstacionamento" element={<LoginEsta />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to={"/404"} />} />
              {/* </Routes> */}
              {/* ) : (
              <Routes> */}
              <Route path="/" element={<LoginAdm />} />
              <Route path="/LoginUsu" element={<LoginUsu />} />
              <Route path="/MeuEstacionamento" element={<LoginEsta />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to={"/404"} />} />
            </Routes>
            {/* )} */}
          </BrowserRouter>
        </SnackbarProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
