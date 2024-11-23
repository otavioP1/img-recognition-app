import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/image-analysis')
  }

  return (
    <Button className="absolute top-6 right-6" variant={'destructive'} onClick={handleLogout}>
      Sair <LogOut/>
    </Button>
  )
}