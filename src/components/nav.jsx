import Navbar from "./navbar";
import { useAuth } from '../services/AuthProvider';

export default function Nav() {
  const { currentUser } = useAuth();
  return <Navbar user={currentUser} /> 
}
