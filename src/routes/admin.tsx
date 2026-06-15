import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminPage } from "@/components/AdminPage";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

function Admin() {
  const navigate = useNavigate();
  return <AdminPage onBack={() => navigate({ to: "/" })} />;
}
