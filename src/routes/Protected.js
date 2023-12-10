import { useAuth } from "../hooks/useAuth";
import { useOutlet, Navigate } from "react-router-dom";

export default function Protected({ Layout }) {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) return <Navigate to="/login" />;

  return <Layout outlet={outlet} />
}