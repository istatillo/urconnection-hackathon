import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthLayout } from "@/components/layout/auth-layout";
import { LoginPage } from "@/pages/auth/login-page";
import { SignUpPage } from "@/pages/auth/sign-up-page";
import { GroupsPage } from "@/pages/groups/groups-page";
import { GroupDetailPage } from "@/pages/groups/group-detail-page";
import { TasksPage } from "@/pages/tasks/tasks-page";
import { TaskCreatePage } from "@/pages/tasks/task-create-page";
import { TaskDetailPage } from "@/pages/tasks/task-detail-page";
import { ComplaintsPage } from "@/pages/complaints/complaints-page";
import { ComplaintDetailPage } from "@/pages/complaints/complaint-detail-page";
import { ProfilePage } from "@/pages/profile/profile-page";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/groups" replace /> },
      { path: "/groups", element: <GroupsPage /> },
      { path: "/groups/:groupId", element: <GroupDetailPage /> },
      { path: "/tasks", element: <TasksPage /> },
      { path: "/tasks/create", element: <TaskCreatePage /> },
      { path: "/tasks/:taskId", element: <TaskDetailPage /> },
      { path: "/complaints", element: <ComplaintsPage /> },
      { path: "/complaints/:complaintId", element: <ComplaintDetailPage /> },
      { path: "/profile", element: <ProfilePage /> },
    ],
  },
]);
