import './App.css';
import '/node_modules/react-grid-layout/css/styles.css'
import '/node_modules/react-resizable/css/styles.css'
import {
  Routes,
  Route,
  RouterProvider,
  createBrowserRouter
} from "react-router-dom";

import PrivateRoutes from './components/private';
import Devices from './pages/devices';
import LoginPage from './pages/public/login';
import RegisterPage from './pages/public/signup';
import ForgotPage from './pages/public/forgot';
import ResetPasswordPage from './pages/public/reset';
import DeviceDetail from './pages/devices/detail';
import { AuthProvider } from './services/AuthProvider';
import { Crisp } from "crisp-sdk-web";
import { useEffect } from 'react';
import MqttClient from './services/ws/MqttClient';

const router = createBrowserRouter([
  { path: "*", Component: Root },
]);
    
function Root() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<PrivateRoutes/>}>
          <Route path="/devices" element={<Devices />} />
          <Route path="/devices/:deviceId" element={<DeviceDetail />} />
        </Route>
      </Routes>
  );
}

function App() {
  const cc = process.env.REACT_APP_CHAT_KEY;
  useEffect(() => {
    if (cc && cc !== '') {
      Crisp.configure(cc);
    }
  }, [cc]);
  

  return (
    <AuthProvider>
      <MqttClient>
        <RouterProvider router={router} />
      </MqttClient>
    </AuthProvider>
  )
}

export default App;
