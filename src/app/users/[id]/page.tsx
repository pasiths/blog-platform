import UserProfile from "@/components/user/user-profile";
import { getCurrentUser } from "@/server/auth/session";

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } =  await params;
  const currentUser = await getCurrentUser();
  return (
    <main className="container mx-auto px-4 py-4 min-h-[calc(100vh-8rem)]">
      <UserProfile id={id} currentUserId={String(currentUser?.id) || ""} />
    </main>
  );
};

export default UserPage;
