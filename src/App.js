import './App.css';
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
import DeviceDetail from './pages/devices/detail';
import { AuthProvider } from './services/AuthProvider';

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
        <Route element={<PrivateRoutes/>}>
          <Route path="/devices" element={<Devices />} />
          <Route path="/devices/:deviceId" element={<DeviceDetail />} />
        </Route>
      </Routes>
  );
}

function App() {
  return <AuthProvider>
    <RouterProvider router={router} />;
    </AuthProvider>
}

export default App;
