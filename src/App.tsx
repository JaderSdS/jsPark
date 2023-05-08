import "./App.css";
import { SnackbarProvider } from "notistack";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginAdm from "./pages/login/LoginAdm";
import LoginEsta from "./pages/login/LoginEsta";
import LoginUsu from "./pages/login/LoginUsu";
import HomeAdm from "./pages/home/HomeAdm";

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
            <Route path="/AdmLoged" element={<HomeAdm />} />
            <Route path="/EstaLoged" element={<LoginUsu />} />
            <Route path="/UsuLoged" element={<LoginUsu />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </div>
  );
}

export default App;
