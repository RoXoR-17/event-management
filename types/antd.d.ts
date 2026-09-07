import "antd/es/button";
import { ButtonColorType } from "antd/es/button";

declare module "antd/es/button" {
  export interface ButtonProps {
    color?: ButtonColorType | "link";
  }
}
