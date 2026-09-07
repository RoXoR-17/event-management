import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, notification } from "antd";
import { useEffect } from "react";

import "@/styles/index.css";
import { themeConfig } from "./themeConfig";

export default function MainProvider({ children }: React.PropsWithChildren) {
  useEffect(() => {
    notification.config({ placement: "bottomRight" });
  }, []);

  return (
    <AntdRegistry>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </AntdRegistry>
  );
}
