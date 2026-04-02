import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signUp } from "@/api/auth";
import { SUBJECTS, GENDER_OPTIONS } from "@/lib/constants";

const signUpSchema = z.object({
  name: z.string().min(1, "Ism kiritilishi shart"),
  phone: z.string().min(1, "Telefon raqam kiritilishi shart"),
  subject: z.string().min(1, "Fan tanlanishi shart"),
  gender: z.enum(["male", "female"], { required_error: "Jins tanlanishi shart" }),
  password: z
    .string()
    .min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak")
    .max(32, "Parol 32 ta belgidan oshmasligi kerak"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignupForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      await signUp(data);
      toast.success("Ro'yxatdan o'tish muvaffaqiyatli!");
      navigate("/login");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { msg?: string } } } })
          ?.response?.data?.error?.msg || "Ro'yxatdan o'tish xatosi";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Ism</Label>
        <Input id="name" placeholder="Ismingiz" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
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
        <Label>Fan</Label>
        <Select onValueChange={(val) => setValue("subject", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Fanni tanlang" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subject && (
          <p className="text-xs text-destructive">{errors.subject.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Jins</Label>
        <div className="flex gap-4">
          {GENDER_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value={opt.value}
                {...register("gender")}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {errors.gender && (
          <p className="text-xs text-destructive">{errors.gender.message}</p>
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
        Ro'yxatdan o'tish
      </Button>
    </form>
  );
}
