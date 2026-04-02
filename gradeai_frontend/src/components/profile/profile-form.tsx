import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { updateProfile } from "@/api/auth";
import { useAuth } from "@/providers/auth-provider";
import { SUBJECTS } from "@/lib/constants";

const profileSchema = z.object({
  name: z.string().min(1, "Ism kiritilishi shart"),
  phone: z.string().min(1, "Telefon raqam kiritilishi shart"),
  subject: z.string().min(1, "Fan tanlanishi shart"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { user, refetchUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      subject: user?.subject || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      await updateProfile(data);
      await refetchUser();
      toast.success("Profil yangilandi");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { msg?: string } } } })
          ?.response?.data?.error?.msg || "Profilni yangilashda xatolik";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="profile-name">Ism</Label>
        <Input id="profile-name" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-phone">Telefon raqam</Label>
        <Input id="profile-phone" type="tel" {...register("phone")} />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Fan</Label>
        <Select
          defaultValue={user?.subject}
          onValueChange={(val) => setValue("subject", val)}
        >
          <SelectTrigger>
            <SelectValue />
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
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Saqlash
      </Button>
    </form>
  );
}
