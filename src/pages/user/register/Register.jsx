import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import "../login/Login.css";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState("register");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Register and send OTP
  const handleRegister = async (event) => {
    event.preventDefault();

    if (form.password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register/send-otp", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setStep("otp");

      toast.success(`Verification code sent to ${form.email.trim()}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to send verification code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and create account
  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register/verify-otp", {
        email: form.email.trim(),
        otp,
      });

      const { token, user } = response.data;

      login(token, user);

      toast.success("Account created successfully!");

      navigate("/", { replace: true });
    } catch (error) {
      const status = error.response?.status;

      const message =
        error.response?.data?.message ||
        "Invalid or expired OTP. Please try again.";

      if (status === 429) {
        setStep("register");
        setOtp("");

        toast.error(
          "Too many incorrect attempts. Please register again to receive a new OTP.",
        );
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);

      await api.post("/auth/register/send-otp", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setOtp("");

      toast.success("A new verification code has been sent.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Google registration
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      const { token, user } = response.data;

      login(token, user);

      toast.success("Account created successfully!");

      navigate(user.role === "ADMIN" ? "/paviknots/admin" : "/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Google registration failed:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message ||
          "Google registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="Login">
      <div className="Login-background">
        <section className="Login-visual">
          <img
            src="/crochet_2.png"
            alt="Crochet yarn and handmade work"
            className="Login-visualImage_2"
          />

          <img
            src="/crochet-login.png"
            alt="Handmade crochet creations"
            className="Login-visualImage"
          />

          <Link to="/" className="Login-brand">
            PaviKnots
          </Link>

          <div className="Login-visualContent">
            <p className="Login-eyebrow">MADE WITH LOVE, JUST FOR YOU</p>

            <h1 className="Login-heading">
              Little Gifts,
              <br />
              <em>Big Feelings</em>
            </h1>

            <span className="Login-line" />

            <p className="Login-visualDescription">
              Join PaviKnots and discover thoughtful, handmade crochet creations
              made with care.
            </p>

            <span className="Login-heart">♡</span>
          </div>
        </section>

        <section className="Register-panel">
          <div className="Login-formContainer">
            <div className="Login-header">
              <p className="Login-cardEyebrow">
                {step === "register" ? "JOIN PAVIKNOTS" : "EMAIL VERIFICATION"}
              </p>

              <h2 className="Login-title">
                {step === "register"
                  ? "Create your account"
                  : "Verify your email"}
              </h2>

              <p className="Login-description">
                {step === "register"
                  ? "Create an account and explore our handmade creations."
                  : `Enter the verification code sent to ${form.email}.`}
              </p>
            </div>

            {step === "register" && (
              <>
                <form className="Login-form" onSubmit={handleRegister}>
                  <div className="Login-field">
                    <label htmlFor="name">Full name</label>

                    <div className="Login-inputWrapper">
                      <FiUser size={18} className="Login-inputIcon" />

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        minLength={2}
                        maxLength={100}
                        required
                      />
                    </div>
                  </div>

                  <div className="Login-field">
                    <label htmlFor="email">Email address</label>

                    <div className="Login-inputWrapper">
                      <FiMail size={18} className="Login-inputIcon" />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="Login-field">
                    <label htmlFor="password">Password</label>

                    <div className="Login-inputWrapper">
                      <FiLock size={18} className="Login-inputIcon" />

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        minLength={8}
                        maxLength={100}
                        required
                      />

                      <button
                        type="button"
                        className="Login-passwordToggle"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="Login-submit"
                    disabled={loading}
                  >
                    <span>
                      {loading
                        ? "Sending verification code..."
                        : "Create Account"}
                    </span>

                    {!loading && <FiArrowRight size={18} />}
                  </button>
                </form>

                <div>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() =>
                      toast.error("Google sign-up was unsuccessful.")
                    }
                    theme="outline"
                    shape="rectangular"
                    size="large"
                    text="signup_with"
                    width="100%"
                  />
                </div>

                <div className="Login-divider">
                  <span />
                  <p>or</p>
                  <span />
                </div>
              </>
            )}

            {step === "otp" && (
              <form className="Login-form" onSubmit={handleVerifyOtp}>
                <div className="Login-field">
                  <label htmlFor="otp">Verification code</label>

                  <div className="Login-inputWrapper">
                    <FiLock size={18} className="Login-inputIcon" />

                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(event) =>
                        setOtp(
                          event.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      placeholder="Enter 6-digit OTP"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="Login-submit"
                  disabled={loading || otp.length !== 6}
                >
                  <span>
                    {loading ? "Verifying..." : "Verify & Create Account"}
                  </span>

                  {!loading && <FiArrowRight size={18} />}
                </button>

                <div className="Register-otpActions">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                  >
                    Resend OTP
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("register");
                      setOtp("");
                    }}
                    disabled={loading}
                  >
                    Change details
                  </button>
                </div>
              </form>
            )}

            {step === "register" && (
              <p className="Login-register">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
