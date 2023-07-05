import { SnackbarProvider } from "notistack";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginAdm from "./pages/administrador/LoginAdm";
import LoginEsta from "./pages/estacionamento/LoginEsta";
import LoginUsuario from "./pages/userPages/LoginUsuario";
import CheckInForm from "./pages/estacionamento/checkIn";
import CheckOutForm from "./pages/estacionamento/checkOut";
import NotFound from "./pages/notFound";
import { AuthProvider } from "./contexts/UserContext";
import { CreateUser } from "./pages/userPages/CreateUser";
import { CreateTicket } from "./pages/userPages/CreateTicket";
import { CreateCar } from "./pages/userPages/CreateCar";
import { UserProfile } from "./pages/userPages/UserProfile";
import ParkingForm from "./pages/administrador/ParkingLotCreateEdit";
import ParkingLotList from "./pages/administrador/ParkingLotList";
import HistoricoTicket from "./pages/userPages/TicketsHistoric";
import { Relatorios } from "./pages/estacionamento/relatorios";

function App() {
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
              {/** Rotas de 404 */}
              <Route path="*" element={<Navigate to={"/404"} />} />
              <Route path="/404" element={<NotFound />} />

              {/** Rotas de usuário  */}
              <Route path="/LoginUsuario" element={<LoginUsuario />} />
              <Route path="/createUser" element={<CreateUser />} />
              <Route path="/createTicket" element={<CreateTicket />} />
              <Route path="/createCar" element={<CreateCar />} />
              <Route path="/editCar/:id" element={<CreateCar />} />
              <Route path="/userProfile" element={<UserProfile />} />
              <Route path="/ticketsHistoric" element={<HistoricoTicket />} />

              {/** Rotas de estacionamento */}
              <Route path="/MeuEstacionamento" element={<LoginEsta />} />
              <Route
                path="/checkIn"
                element={<CheckInForm onSubmit={() => {}} />}
              />
              <Route path="/checkOut" element={<CheckOutForm />} />
              <Route path="/relatorio" element={<Relatorios />} />

              {/** Rotas de administrador */}
              <Route path="/" element={<LoginAdm />} />
              <Route path="/AdmLoged" element={<ParkingLotList />} />
              <Route
                path="/addEstacionamento"
                element={<ParkingForm onSubmit={() => {}} />}
              />
              <Route path="/listEstacionamentos" element={<ParkingLotList />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
