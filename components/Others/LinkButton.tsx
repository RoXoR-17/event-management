import { Button, ButtonProps } from "antd";

interface LinkButtonProps extends ButtonProps {
  underline?: boolean;
}

function LinkButton({ underline, children, ...props }: LinkButtonProps) {
  return (
    <Button
      type="link"
      style={{
        padding: 0,
        fontWeight: "500",
        ...(underline ? { textDecoration: "underline" } : {}),
      }}
      size="small"
      {...props}
    >
      {children}
    </Button>
  );
}

export default LinkButton;
