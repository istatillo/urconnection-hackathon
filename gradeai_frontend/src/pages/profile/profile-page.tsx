import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";

export function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profil" description="Shaxsiy ma'lumotlaringizni boshqaring" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shaxsiy ma'lumotlar</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parolni o'zgartirish</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
