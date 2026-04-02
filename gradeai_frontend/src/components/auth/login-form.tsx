import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import { login } from "@/api/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  phone: z.string().min(1, "Telefon raqam kiritilishi shart"),
  password: z.string().min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { setTokens } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await login(data);
      setTokens(res.access_token, res.refresh_token);
      navigate("/groups");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { msg?: string } } } })
          ?.response?.data?.error?.msg || "Kirish xatosi";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Telefon raqam</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+998901234567"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Parol</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Kirish
      </Button>
    </form>
  );
}
