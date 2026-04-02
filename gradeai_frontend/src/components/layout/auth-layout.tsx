import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/groups" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">GradeAI</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O'qituvchilar uchun AI baholash tizimi
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
