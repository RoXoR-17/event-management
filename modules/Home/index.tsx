import { Typography } from "antd";

import BasicCard from "@/components/BasicCard";
import styles from "./index.module.css";

function Home() {
  return (
    <BasicCard title={null} variant="borderless">
      <div className={styles.container}>
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          Coming Soon
        </Typography.Title>
        <Typography.Text style={{ textAlign: "center" }}>
          Come back later for a surprise you won’t want to miss.
        </Typography.Text>
      </div>
    </BasicCard>
  );
}

export default Home;
