import {
  BellOutlined,
  CompassFilled,
  HomeOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  ThunderboltFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Divider, Dropdown, Layout, Menu, MenuProps, Tooltip, Typography } from "antd";
import Image from "next/image";
import { useState, useTransition } from "react";

import AppointmentForm from "@/modules/Appointments/AppointmentForm";
import { logout } from "@/utils/actions/authentication";
import { NavLayoutType, useMainContext } from "@/utils/helpers/context";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { appPathnames } from "./constant";
import styles from "./index.module.css";

const { Header, Sider } = Layout;

const menuItemsMap = {
  "/home": { key: "home", label: "Dashboard", icon: <HomeOutlined /> },
  // "/team-members": { key: "team-members", label: "Team Members", icon: <TeamOutlined /> },
  // "/patients": { key: "patients", label: "Patients", icon: <TeamOutlined /> },
  // "/appointments": { key: "appointments", label: "Appointments", icon: <ScheduleOutlined /> },
} as const satisfies Record<(typeof appPathnames)[number], NonNullable<MenuProps["items"]>[number]>;

const menuItems = appPathnames.map((path) => menuItemsMap[path]) satisfies MenuProps["items"];

const NavMenu = ({ navLayoutType }: { navLayoutType: NavLayoutType }) => {
  const router = useRouter();
  const pathname = usePathname();
  const selectedKey = menuItems.find((item) => pathname.includes(item.key))?.key;

  return (
    <Menu
      mode={navLayoutType === "top" ? "horizontal" : "inline"}
      theme="dark"
      items={menuItems.map((menuItemData) => ({
        ...menuItemData,
        onClick: () => router.push(menuItemData.key),
      }))}
      disabledOverflow
      defaultSelectedKeys={[selectedKey ?? "home"]}
    />
  );
};

interface NavLayoutCompProps extends React.PropsWithChildren {
  onCreateAppointment: () => void;
}

const NavHeader = ({ onCreateAppointment, children }: NavLayoutCompProps) => {
  const [isLogoutActionPending, startTransition] = useTransition();
  const headerMenuItems: MenuProps["items"] = [
    // {
    //   key: "1",
    //   type: "group",
    //   label: (
    //     <Flex gap={4}>
    //       {colorOptions.map((color) => (
    //         <div
    //           key={color}
    //           className={`${styles.color_box} ${
    //             color === primaryColor ? styles.active : ""
    //           }`}
    //           style={{ backgroundColor: color }}
    //           onClick={() => primaryColorChangeHandler(color)}
    //         />
    //       ))}
    //     </Flex>
    //   ),
    // },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => startTransition(() => logout()),
    },
  ];

  return (
    <Header className={styles.header}>
      <Link href="/">
        <Image src="/logo.png" alt={""} width={40} height={40} />
        <Typography.Title level={4} ellipsis>
          Purple Party Planner
        </Typography.Title>
      </Link>
      <Divider type="vertical" className={styles.divider} />
      <div className={styles.header_menu}>{children}</div>
      <Button color="link" variant="solid" onClick={onCreateAppointment}>
        Create Appointment
      </Button>
      <Divider type="vertical" className={styles.divider} />
      <div className={styles.header_actions}>
        <Button shape="circle" icon={<BellOutlined />} type="primary" danger />
        <Dropdown
          menu={{ items: headerMenuItems }}
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
        >
          <Button
            shape="circle"
            icon={<UserOutlined />}
            loading={isLogoutActionPending}
            type="default"
          />
        </Dropdown>
      </div>
    </Header>
  );
};

const NavSidebar = ({ onCreateAppointment, children }: NavLayoutCompProps) => {
  const [isLogoutActionPending, startTransition] = useTransition();

  return (
    <Sider theme="dark" className={styles.sidebar} collapsible width={220} collapsedWidth={60}>
      <Tooltip title="Purple Party Planner" placement="right">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <Typography.Title level={4} ellipsis>
            Purple Party Planner
          </Typography.Title>
        </Link>
      </Tooltip>
      {/* <Divider type="horizontal" className={styles.divider} /> */}
      <Tooltip title="Navigation" placement="right">
        <Typography.Title level={5} ellipsis>
          <CompassFilled /> <i>Navigation</i>
        </Typography.Title>
      </Tooltip>
      <div className={styles.sidebar_menu}>{children}</div>
      <Tooltip title="Quick Actions" placement="right">
        <Typography.Title level={5} ellipsis>
          <ThunderboltFilled /> <i>Quick Actions</i>
        </Typography.Title>
      </Tooltip>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[]}
        items={[
          {
            key: "create-appointment",
            label: "Create Appointment",
            icon: <PlusCircleOutlined />,
            onClick: onCreateAppointment,
          },
          {
            key: "logout",
            label: "Logout",
            icon: <LogoutOutlined />,
            onClick: () => startTransition(() => logout()),
            disabled: isLogoutActionPending,
          },
        ]}
      />
    </Sider>
  );
};

function NavLayout() {
  const { navLayoutType, setRefetchAppointments } = useMainContext();
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const NavLayoutComponent = navLayoutType === "top" ? NavHeader : NavSidebar;

  const onCreateAppointmentHandler = () => setShowAppointmentForm(true);

  return (
    <NavLayoutComponent onCreateAppointment={onCreateAppointmentHandler}>
      <NavMenu navLayoutType={navLayoutType} />
      <AppointmentForm
        show={showAppointmentForm}
        onClose={(success) => {
          if (success) setRefetchAppointments(true);
          setShowAppointmentForm(false);
        }}
      />
    </NavLayoutComponent>
  );
}

export default NavLayout;
