import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/signup-form";

export function SignUpPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <SignupForm />
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Hisobingiz bormi?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Kirish
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
