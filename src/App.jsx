import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "./components/UI/Toast";

export const App = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppProviderConsumer />
      </AppProvider>
    </BrowserRouter>
  );
};

// Sub-wrapper to supply AppContext parameters safely into AuthProvider
const AppProviderConsumer = () => {
  const { employees, addEmployee, addToast } = useApp();

  return (
    <AuthProvider employees={employees} addEmployee={addEmployee} addToast={addToast}>
      <AppRoutes />
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;
