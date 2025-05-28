import { SettingCom } from "@/components/setting/setting";
import { getCurrentUser } from "@/server/auth/session";


const SettingPage = async () => {
  const user = await getCurrentUser();
  return (
    <main className="container mx-auto px-75 py-4 min-h-[calc(100vh-8rem)]">
      <SettingCom user={user} />
    </main>
  );
};

export default SettingPage;
