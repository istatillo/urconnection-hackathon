import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { Loader2, Upload, X } from "lucide-react";
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
import { useCreateTask } from "@/hooks/use-tasks";
import { useGroups } from "@/hooks/use-groups";

const createTaskSchema = z.object({
  name: z.string().min(1, "Topshiriq nomi kiritilishi shart"),
  group: z.string().min(1, "Guruh tanlanishi shart"),
  deadline: z.string().min(1, "Muddat kiritilishi shart"),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export function CreateTaskForm() {
  const navigate = useNavigate();
  const createTask = useCreateTask();
  const { data: groups } = useGroups();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
  });

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: CreateTaskFormData) => {
    if (!imageFile) {
      toast.error("Rasm yuklash shart");
      return;
    }
    try {
      await createTask.mutateAsync({
        name: data.name,
        group: data.group,
        deadline: new Date(data.deadline).toISOString(),
        image: imageFile,
      });
      toast.success("Topshiriq yaratildi");
      navigate("/tasks");
    } catch {
      toast.error("Topshiriq yaratishda xatolik");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
      <div className="space-y-2">
        <Label htmlFor="task-name">Topshiriq nomi</Label>
        <Input
          id="task-name"
          placeholder="Masalan: 1-nazorat ishi"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Guruh</Label>
        <Select onValueChange={(val) => setValue("group", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Guruhni tanlang" />
          </SelectTrigger>
          <SelectContent>
            {groups?.map((g) => (
              <SelectItem key={g._id} value={g._id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.group && (
          <p className="text-xs text-destructive">{errors.group.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline">Muddat</Label>
        <Input id="deadline" type="datetime-local" {...register("deadline")} />
        {errors.deadline && (
          <p className="text-xs text-destructive">{errors.deadline.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Topshiriq rasmi</Label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-48 rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-muted/50">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Rasm yuklash uchun bosing
            </span>
            <span className="text-xs text-muted-foreground">
              JPG, PNG, WEBP (max 10MB)
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/tasks")}
        >
          Bekor qilish
        </Button>
        <Button type="submit" disabled={createTask.isPending}>
          {createTask.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Yaratish
        </Button>
      </div>
    </form>
  );
}
