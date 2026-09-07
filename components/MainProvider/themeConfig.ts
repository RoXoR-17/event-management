import { ThemeConfig } from "antd";

export const themeConfig: ThemeConfig = {
  hashed: false,
  cssVar: { prefix: "rs" },
  token: {
    fontFamily: "var(--rs-primary-font)",
    colorWhite: "rgb(255, 255, 255)",
    colorPrimary: "#2c2c2c",
    colorText: "#2c2c2c",
    colorTextBase: "#2c2c2c",
    colorTextPlaceholder: "#6b6b6b",
    colorBorder: "#8fa1b2",
    colorBorderSecondary: "#2f4e7377",
    colorLink: "#3a5f8a",
    colorLinkHover: "#2f4e73",
    colorLinkActive: "#243d59",
  },
  components: {
    Layout: {
      headerPadding: "0 4vmin",
      headerBg: "#2c2c2c",
      siderBg: "#2c2c2c",
      triggerBg: "transparent",
      bodyBg: "#f0f4f9",
    },
    Menu: {
      darkItemBg: "#2c2c2c",
      darkItemSelectedBg: "#fff",
      darkItemSelectedColor: "#2c2c2c",
      horizontalItemBorderRadius: 4,
    },
    Card: {
      bodyPaddingSM: 0,
    },
    Button: {
      primaryShadow: "none",
    },
    Table: {
      headerBorderRadius: 0,
      headerBg: "#2f4e7322",
      rowHoverBg: "#2f4e7311",
    },
    Dropdown: {
      controlItemBgActive: "#2f4e7322",
      controlItemBgActiveHover: "#2f4e7322",
      controlItemBgHover: "#2f4e7311",
    },
    Form: {
      verticalLabelPadding: "0 0 2px",
      fontSize: 12,
      itemMarginBottom: 20,
    },
    Select: {
      optionSelectedColor: "#fff",
    },
    DatePicker: {
      controlItemBgActive: "#2c2c2c",
    },
    Descriptions: {
      labelBg: "#2f4e7311",
    },
  },
};
