import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";

import styles from "./index.module.css";

export function GenerateOtpForm({ submitting = false, onSubmit = () => {} }) {
  return (
    <Form
      name="login-mobile"
      onFinish={onSubmit}
      layout="vertical"
      requiredMark={false}
      size="large"
    >
      <Form.Item
        name="mobile"
        label="Mobile Number"
        rules={[
          { required: true, message: "Please enter your mobile number!" },
          { min: 10, message: "Please enter valid mobile number!" },
        ]}
      >
        <Input
          maxLength={10}
          prefix={<UserOutlined className={styles.login_input_icon} />}
          placeholder="Enter Mobile Number"
          autoFocus
        />
      </Form.Item>
      <Form.Item>
        <Button
          size="large"
          loading={submitting}
          type="primary"
          htmlType="submit"
          className={styles.login_btn}
          id="sign-in-button"
        >
          Proceed to Verification
        </Button>
      </Form.Item>
    </Form>
  );
}

export function ValidateOtpForm({
  submitting = false,
  onSubmit = () => {},
  onResendOtp = () => {},
  onChangeMobileNumber = () => {},
}) {
  return (
    <Form name="login-otp" onFinish={onSubmit} layout="vertical" requiredMark={false} size="large">
      <div className={styles.resendOtpContainer}>
        <span onClick={onResendOtp}>Resend OTP</span>
        <span onClick={onChangeMobileNumber}>Change mobile number</span>
      </div>
      <Form.Item
        name="otp"
        rules={[
          {
            required: true,
            message: "Please enter OTP sent to your mobile number!",
          },
        ]}
      >
        <Input.OTP style={{ gap: "16px", width: "100%" }} type="number" autoFocus />
      </Form.Item>
      <Form.Item>
        <Button
          size="large"
          loading={submitting}
          type="primary"
          htmlType="submit"
          className={styles.login_btn}
        >
          Verify and Login
        </Button>
      </Form.Item>
    </Form>
  );
}
