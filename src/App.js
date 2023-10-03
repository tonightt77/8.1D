import React from "react";
import NavFooter from "./routes/NavFooter";
import HomePage from "./routes/HomePage";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import FindDev from "./routes/FindDev";
import FindJob from "./routes/FindJob";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from ".//AuthContext";

function App() {
  return (
    <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<NavFooter />}>
              <Route index element={<HomePage />} />
              <Route path="find-dev" element={<FindDev />} />
              <Route path="find-job" element={<FindJob />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Signup />} />
            </Route>
          </Routes>
        </div>
    </AuthProvider>
  );
}

export default App;
