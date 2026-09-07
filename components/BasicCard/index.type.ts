import { CardProps } from "antd/es/card";

export interface BasicCardProps extends React.PropsWithChildren {
  title?: string | React.ReactNode;
  variant?: CardProps["variant"];
}
