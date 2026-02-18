
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
<AuthProvider>
<BrowserRouter>
<Routes>
<Route path="/login" element={<Login />} />
<Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
</Routes>
</BrowserRouter>
</AuthProvider>
);
