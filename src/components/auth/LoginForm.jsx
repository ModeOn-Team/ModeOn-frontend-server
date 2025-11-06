import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Login = ({ onSwitch }) => {
  const { login, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const isEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginData = isEmail(formData.emailOrUsername)
        ? { email: formData.emailOrUsername, password: formData.password }
        : { username: formData.emailOrUsername, password: formData.password };

      await login(loginData);
      onSwitch("login");
    } catch (err) {
        alert("Login failed: " + err.response + ", " + err.response.status + ", " + err.response.data.message);
      if (
        err.response &&
        err.response.status === 403 &&
        err.response.data.message === "계정 활성화가 필요합니다."
      ) {
        console.log("switch to emailVerification");
        onSwitch("emailVerification");
      } else {
        setError(
          err.response?.data?.message || "로그인 중 오류가 발생했습니다."
        );
      }
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/oauth2/authorization/${provider}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md">
      <div className="flex justify-end w-full">
        <p className="text-gray-500">
          <div onClick={() => onSwitch("signup")}>Sign up</div>
        </p>
      </div>
      <form className="form-group" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="emailOrUsername"
          placeholder="Email address or Username"
          value={formData.emailOrUsername}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <p className="text-error">{error}</p>}

        <div className="flex justify-between gap-4">
          <Button
            type="button"
            className="mt-4 w-auto py-2 text-sm"
            variant="textRed"
            onClick={() => onSwitch("changePassword")}
          >
            forgot password?
          </Button>
          <div className="flex justify-between ml-10">
            <Button
              variant="iconButton"
              icon={<FcGoogle className="w-6 h-6 mt-4 " />}
              iconOnly
              onClick={() => handleSocialLogin("google")}
            ></Button>
            <Button
              variant="iconButton"
              icon={<FaGithub className="w-6 h-6 mt-4 " />}
              iconOnly
              onClick={() => handleSocialLogin("github")}
            ></Button>
          </div>
          <Button
            className="mt-4 w-auto text-sm"
            type="submit"
            disabled={
              loading || !formData.emailOrUsername || !formData.password
            }
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
