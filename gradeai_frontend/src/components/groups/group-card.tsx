import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GroupWithCount } from "@/types/group";
import { GROUP_STATUS_LABELS } from "@/lib/constants";

interface GroupCardProps {
  group: GroupWithCount;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link to={`/groups/${group._id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="font-medium">{group.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{group.member_count} ta talaba</span>
            </div>
          </div>
          <Badge variant={group.status === "open" ? "default" : "secondary"}>
            {GROUP_STATUS_LABELS[group.status]}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
