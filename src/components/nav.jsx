import Navbar from "./navbar";

export default function Nav() {
  const session = {}
  return <Navbar user={session.user} /> 
}
