import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/api/auth";
import { useAuth } from "@/providers/auth-provider";

const passwordSchema = z.object({
  current_password: z.string().min(1, "Joriy parol kiritilishi shart"),
  new_password: z
    .string()
    .min(8, "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak")
    .max(32, "Yangi parol 32 ta belgidan oshmasligi kerak"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    try {
      await updatePassword(data);
      toast.success("Parol yangilandi. Qayta kiring.");
      logout();
      navigate("/login");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { msg?: string } } } })
          ?.response?.data?.error?.msg || "Parolni yangilashda xatolik";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-password">Joriy parol</Label>
        <Input
          id="current-password"
          type="password"
          {...register("current_password")}
        />
        {errors.current_password && (
          <p className="text-xs text-destructive">
            {errors.current_password.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">Yangi parol</Label>
        <Input
          id="new-password"
          type="password"
          {...register("new_password")}
        />
        {errors.new_password && (
          <p className="text-xs text-destructive">
            {errors.new_password.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Parolni yangilash
      </Button>
    </form>
  );
}
