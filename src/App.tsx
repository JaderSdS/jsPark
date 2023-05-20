import { SnackbarProvider } from "notistack";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginAdm from "./pages/login/LoginAdm";
import LoginEsta from "./pages/login/LoginEsta";
import LoginUsu from "./pages/login/LoginUsu";
import ParkingLotList from "./pages/crud/parkingLot/ParkingLotList";
import ParkingForm from "./pages/crud/parkingLot/ParkingLotCreateEdit";
import ParkingDetails from "./pages/crud/parkingLot/ParkingLotDetails";
import CheckInForm from "./pages/estacionamento/checkIn";
import CheckOutForm from "./pages/estacionamento/checkOut";

function App() {
  return (
    <div className="App">
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
          <Routes>
            <Route path="/" element={<LoginAdm />} />
            <Route path="/LoginEsta" element={<LoginEsta />} />
            <Route path="/LoginUsu" element={<LoginUsu />} />
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

            <Route
              path="/seeEstacionamento"
              element={
                <ParkingDetails
                  formData={{
                    name: "TestName",
                    address: "adress fake test",
                    capacity: "2123",
                    price: "asda",
                    policies: {
                      cancellation: "asadsd",
                      refund: "adsadasda",
                      other: "dasasdasdasdasd",
                    },
                    additionalInfo: {
                      description: "adasdadsadadasda",
                      instructions: "dasdasdadaddsa",
                    },
                  }}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </div>
  );
}

export default App;
