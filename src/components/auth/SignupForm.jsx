import { useState } from "react";
import useAuthStore from "../../store/authStore";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const SignupFrom = ({ onSwitch }) => {

  const { register, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      onSwitch("emailVerification");
    } catch (err) {
      console.error(err);
    }
  };

  const isFormValid =
    formData.email &&
    formData.fullName &&
    formData.address &&
    formData.username &&
    formData.password;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md">
      <form className="form-group" onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <Input
          type="address"
          name="address"
          placeholder="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <Input
          name="username"
          placeholder="Username"
          value={formData.username}
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
            className="mt-4 w-auto py-2 text-sm"
            variant="textRed"
            onClick={() => onSwitch("login")}
          >
            Already have an account?
          </Button>
          <div className="flex justify-between ml-10">
            <Button
              variant="iconButton"
              iconOnly
              onClick={() => handleSocialLogin("google")}
            ></Button>
            <Button
              variant="iconButton"
              iconOnly
              onClick={() => handleSocialLogin("github")}
            ></Button>
          </div>
          <Button
            className="mt-4 w-auto text-sm"
            type="submit"
            disabled={loading || !isFormValid}
          >
            {loading ? "Signing up..." : "Sign up"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignupFrom;
