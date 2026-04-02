import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export function LoginPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <LoginForm />
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Hisobingiz yo'qmi?{" "}
          <Link to="/sign-up" className="font-medium text-primary hover:underline">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
