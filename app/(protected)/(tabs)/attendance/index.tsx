import { useUserStore } from "@/store/useUserStore";
import OwnerAttendanceView from "./_views/OwnerAttendanceView";
import AdminAttendanceView from "./_views/AdminAttendanceView";
import UserAttendanceView from "./_views/UserAttendanceView";

export default function AttendancePage() {
  const { user } = useUserStore();

  if (!user) return null;

  switch (user.role) {
    case "OWNER":
      return <OwnerAttendanceView />;
    case "ADMIN":
      return <AdminAttendanceView />;
    default:
      return <UserAttendanceView />;
  }
}
