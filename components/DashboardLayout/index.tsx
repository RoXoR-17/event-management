import type { User } from "@supabase/supabase-js";
import { Layout, Spin } from "antd";
import { useEffect } from "react";

import { MainContextProvider } from "@/utils/helpers/context";
import useInstallPrompt from "@/utils/hooks/InstallPrompt/useInstallPrompt";
import { useOnNavigate } from "@/utils/hooks/OnNavigate/useOnNavigate";
import usePushNotification from "@/utils/hooks/PushNotification/usePushNotification";
import styles from "./index.module.css";
import IosInstallInfoPopover from "./IosInstallInfoPopover";
import NavLayout from "./NavLayout";

const { Content } = Layout;

interface DashboardLayoutProps extends React.PropsWithChildren {
  user: User | null;
}

function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const { showIosInstallInfo } = useInstallPrompt();
  const { subscription, subscribeToPush } = usePushNotification();
  const loading = useOnNavigate();

  useEffect(() => {
    if (!subscription) subscribeToPush();
  }, []);

  return (
    <MainContextProvider user={user}>
      <Layout className={styles.wrapper}>
        <NavLayout />
        <Content className={`${styles.container} ${loading ? styles.loading : ""}`}>
          {children}
          <Spin className={styles.loader} size="large" spinning={loading} />
        </Content>
        <IosInstallInfoPopover showIosInstallInfo={showIosInstallInfo} />
      </Layout>
    </MainContextProvider>
  );
}

export default DashboardLayout;
