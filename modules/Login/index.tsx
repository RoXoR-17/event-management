import { Layout, message } from "antd";
import { useState, useTransition } from "react";

import { login } from "@/utils/actions/authentication";
import {
  VALID_EMAIL_ID,
  VALID_MOBILE_NUMBDER,
  VALID_MOBILE_OTP,
  VALID_PASSWORD,
} from "@/utils/db/db.constant";
import styles from "./index.module.css";
import { GenerateOtpForm, ValidateOtpForm } from "./LoginForm";

function Login() {
  const [isLoginActionPending, startTransition] = useTransition();
  const [mobileNumber, setMobileNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sendOtpHandler = (values = { mobile: mobileNumber }) => {
    if (values.mobile.trim() !== VALID_MOBILE_NUMBDER) {
      message.error("Please enter registered mobile number");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setMobileNumber(values.mobile);
      setSubmitting(false);
    }, 2000);
  };

  const resendOtpHandler = () => {
    sendOtpHandler();
  };

  const validateOtpHandler = async (values = { otp: "" }) => {
    if (values.otp.trim() !== VALID_MOBILE_OTP) {
      message.error("Please enter valid OTP!");
      return;
    }

    setSubmitting(true);

    const email = VALID_EMAIL_ID;
    const password = VALID_PASSWORD;

    const searchParams = new URLSearchParams(window.location.search);
    const redirectPath = searchParams.get("redirect");
    startTransition(() => login(email, password, redirectPath));
    setSubmitting(false);
  };

  return (
    <Layout>
      <div className={styles.wrapper}>
        <div className={styles.left_section}>
          <div className={styles.left_section_bg} />
          <div className={styles.left_section_semi_circle} />
          <div className={styles.left_section_circle} />
        </div>
        <div className={styles.right_section}>
          <div className={styles.right_section_main}>
            <div className={styles.right_section_logo} />
            <h1 className={styles.right_section_title}>Welcome</h1>
            {!mobileNumber ? (
              <GenerateOtpForm submitting={submitting} onSubmit={sendOtpHandler} />
            ) : (
              <ValidateOtpForm
                submitting={submitting || isLoginActionPending}
                onSubmit={validateOtpHandler}
                onResendOtp={resendOtpHandler}
                onChangeMobileNumber={() => setMobileNumber("")}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
