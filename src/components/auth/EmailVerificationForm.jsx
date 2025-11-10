import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";

import Button from "../ui/Button";
import Input from "../ui/Input";

const EmailVerificationForm = ({ onSwitch, mode }) => {
  const {
    PasswordResetCode,
    resetPassword,
    verifyEmail,
    sendEmail,
    loading,
    error,
  } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    authCode: "",
    code: "",
  });
  const [emailSent, setEmailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!emailSent) return;

    setTimeLeft(180);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [emailSent]);

  const SendhandleSubmit = async (e) => {
    e.preventDefault();
    try {
      setEmailSent(true);
      await sendEmail(formData.email);
    } catch (err) {
      console.error(err);
      setEmailSent(false);
    }
  };

  const VerifyhandleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("mode:", mode);
      if (mode === "changePassword") {
        console.log("Attempting to get password reset code",  formData.code, formData.email);
        const token = await PasswordResetCode(formData.code, formData.email);
        console.log("token:", token);

        setFormData((prev) => ({ ...prev, authCode: token }));
        console.log("formData after setting token:", formData);
        setIsVerified(true);
      } else if (mode === "emailVerification") {
        await verifyEmail(formData.code, formData.email);
        onSwitch("login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const PasswordhandleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await resetPassword({
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        authCode: formData.authCode,
      });
      alert("Password successfully changed!");
      onSwitch("login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md">
      {!isVerified ? (
        <>
          <form className="form-group" onSubmit={SendhandleSubmit}>
            <div className="flex flex-row gap-4 w-full">
              <Input
                className="flex-1 h-10"
                type="text"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={emailSent}
              />

              <Button
                className="h-10 px-4"
                type="submit"
                disabled={loading || !formData.email || emailSent}
              >
                {"인증 번호 전송"}
              </Button>
            </div>

            {emailSent && !error && (
              <div className="text-sm text-blue-500 flex justify-end mt-2 gap-4">
                <p>이메일 전송 완료</p>
                <p
                  className="text-sm text-blue-500 cursor-pointer underline"
                  onClick={() => setEmailSent(false)}
                >
                  이메일 재입력
                </p>
              </div>
            )}

            {!emailSent && error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </form>

          <form className="form-group mt-4" onSubmit={VerifyhandleSubmit}>
            <div className="flex flex-row gap-4 w-full">
              <Input
                className="flex-1 h-10"
                type="text"
                name="code"
                placeholder="Enter verification code"
                value={formData.code}
                onChange={handleChange}
                required
              />
              <Button
                className="h-10 px-4"
                type="submit"
                disabled={loading || !formData.email || !formData.code}
              >
                {loading ? "이메일 전송중" : "인증 번호 확인"}
              </Button>
            </div>

            {emailSent && (
              <div className="flex justify-end mt-2 gap-4">
                <p className="text-sm text-red-500">
                  {timeLeft > 0 ? formatTime(timeLeft) : "시간 초과"}
                </p>
                <p
                  className="text-sm text-blue-500 cursor-pointer underline"
                  onClick={(e) => {
                    e.preventDefault();
                    SendhandleSubmit(e);
                    setTimeLeft(180);
                  }}
                >
                  재발송
                </p>
              </div>
            )}
          </form>
          {emailSent && error && <p className="text-error mt-2">{error}</p>}
        </>
      ) : (
        <>
          <form className="form-group mt-4" onSubmit={PasswordhandleSubmit}>
            <Input
              className="mb-1"
              type="password"
              name="password"
              placeholder="새 비밀번호"
              value={formData.password || ""}
              onChange={handleChange}
              required
            />
            <Input
              className="mb-1"
              type="password"
              name="password2"
              placeholder="비밀번호 확인"
              value={formData.password2 || ""}
              onChange={handleChange}
              required
            />
            <Button
              className="mt-2"
              type="submit"
              disabled={loading || !formData.password || !formData.password2}
            >
              {loading ? "loading in..." : "비밀번호 변경"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default EmailVerificationForm;
