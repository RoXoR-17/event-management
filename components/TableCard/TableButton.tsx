import { Button, ButtonProps } from "antd";
import { useState } from "react";

import { ButtonActionTypeEnum, TableButtonProps } from "./index.type";

const colorMap: Record<ButtonActionTypeEnum, ButtonProps["color"]> = {
  [ButtonActionTypeEnum.ADD]: "link",
  [ButtonActionTypeEnum.IMPORT]: "primary",
  [ButtonActionTypeEnum.EXPORT]: "primary",
};

function TableButton({ type, label, icon, loading, disabled, onAction }: TableButtonProps) {
  const [clickEventRunning, setClickEventRunning] = useState(false);

  const clickEventHandler = async () => {
    if (!onAction) return;

    try {
      setClickEventRunning(true);
      await onAction(type);
    } catch (error) {
      console.error("", error);
    } finally {
      setClickEventRunning(false);
    }
  };

  // switch for import & export styling maybe
  return (
    <Button
      variant="solid"
      type="primary"
      color={colorMap[type]}
      icon={icon}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        clickEventHandler();
      }}
      loading={loading || clickEventRunning}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}

export default TableButton;
