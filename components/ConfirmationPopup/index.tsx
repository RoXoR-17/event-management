import { Flex, Typography } from "antd";

import PopupModal, { PopupModalProps } from "@/components/PopupModal";

export interface ConfirmationPopupProps extends PopupModalProps {
  icon?: React.ReactNode;
  subTitle?: string;
}

function ConfirmationPopup({ title, subTitle, children, ...props }: ConfirmationPopupProps) {
  return (
    <PopupModal closable={false} {...props}>
      <Flex gap="1rem" align="center" style={{ marginBottom: "1.2rem" }}>
        {props.icon}
        <Flex vertical>
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            {title}
          </Typography.Title>
          <Typography.Text>{subTitle}</Typography.Text>
        </Flex>
      </Flex>
      {children}
    </PopupModal>
  );
}

export default ConfirmationPopup;
