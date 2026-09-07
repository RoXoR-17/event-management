import { Card, Typography } from "antd";

import styles from "./index.module.css";
import { BasicCardProps } from "./index.type";

function BasicCard({ title, children, ...props }: BasicCardProps) {
  return (
    <Card
      size="small"
      // variant="borderless"
      className={styles.card}
      title={
        typeof title === "string" ? (
          <Typography.Title level={4} className={styles.card_title}>
            {title}
          </Typography.Title>
        ) : (
          title
        )
      }
      {...props}
    >
      {children}
    </Card>
  );
}

export default BasicCard;
