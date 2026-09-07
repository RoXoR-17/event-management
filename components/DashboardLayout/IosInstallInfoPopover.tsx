import { Fragment } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { FloatButton, Popover } from "antd";

const iosInstallInfoContent = (
  <p>
    To install this app on your iOS device, tap the share button
    <span role="img" aria-label="share icon">
      {" "}
      ⎋{" "}
    </span>
    and then tap the &quot;Add to Home Screen&quot;
    <span role="img" aria-label="plus icon">
      {" "}
      ➕{" "}
    </span>{" "}
    text.
  </p>
);

function IosInstallInfoPopover({ showIosInstallInfo = false }) {
  return !showIosInstallInfo ? null : (
    <Fragment>
      <Popover content={iosInstallInfoContent} title="Install Application" trigger="click">
        <FloatButton icon={<DownloadOutlined />} />
      </Popover>
    </Fragment>
  );
}

export default IosInstallInfoPopover;
