import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import { positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { AuthProvider } from "./effects/use-auth";
import { AxiosProvider } from "./effects/use-axios";
import ProtectedRoutes from "./ProtectedRoutes";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AlertProvider
        template={AlertTemplate}
        position={positions.TOP_RIGHT}
        timeout={5000}
      >
        <AuthProvider>
          <AxiosProvider>
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/*" element={<App />} />
              </Route>
            </Routes>
          </AxiosProvider>
        </AuthProvider>
      </AlertProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
