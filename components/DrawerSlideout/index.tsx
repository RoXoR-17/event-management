import { Drawer, DrawerProps } from "antd";

export interface DrawerSlideoutProps extends DrawerProps {
  show: boolean;
}

function DrawerSlideout({ show, children, ...props }: DrawerSlideoutProps) {
  return (
    <Drawer open={show} placement="right" {...props}>
      {children}
    </Drawer>
  );
}

export default DrawerSlideout;
