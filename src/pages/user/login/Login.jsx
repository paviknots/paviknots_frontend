import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import "./Login.css";
import { useAuth } from "../../../context/AuthContext";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      const { token, user } = response.data;

      login(token, user);

      toast.success("Signed in successfully!");

      navigate(user.role === "ADMIN" ? "/paviknots/admin" : "/", {
        replace: true,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const { token, user } = response.data;

      login(token, user);

      toast.success("Welcome back to PaviKnots!");

      if (user.role === "ADMIN") {
        navigate("/paviknots/admin", { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to sign in. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        // Note: tokenResponse contains an access_token, not a JWT credential.
        // See Step 2 below for backend adjustments.
        const response = await api.post("/auth/google", {
          access_token: tokenResponse.access_token,
        });

        const { token, user } = response.data;
        login(token, user);
        toast.success("Signed in successfully!");
        navigate(user.role === "ADMIN" ? "/paviknots/admin" : "/", {
          replace: true,
        });
      } catch (error) {
        toast.error("Google sign-in failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Google sign-in failed."),
  });
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
            alt="Crochet yarn and handmade work"
            className="Login-visualImage"
          />

          <Link to="/" className="Login-brand">
            PaviKnots
          </Link>

          <div className="Login-visualContent">
            <p className="Login-eyebrow">HANDMADE WITH LOVE</p>

            <h1 className="Login-heading">
              Little Gifts,
              <br />
              <em>Big Feelings</em>
            </h1>

            <span className="Login-line" />

            <p className="Login-visualDescription">
              Sign in to continue your handmade journey and bring home more
              pieces you love.
            </p>

            <span className="Login-heart">♡</span>
          </div>
        </section>

        <section className="Login-panel">
          <div className="Login-formContainer">
            <div className="Login-header">
              <p className="Login-cardEyebrow">WELCOME BACK</p>

              <h2 className="Login-title">Sign in to your account</h2>

              <p className="Login-description">
                Continue exploring handmade crochet creations at PaviKnots.
              </p>
            </div>

            <form className="Login-form" onSubmit={handleSubmit}>
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

                <div className="Login-forgotWrapper">
                  <Link to="/forgot-password" className="Login-forgot">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button type="submit" className="Login-submit" disabled={loading}>
                <span>{loading ? "Signing in..." : "Sign In"}</span>

                {!loading && <FiArrowRight size={18} />}
              </button>

              <button
                type="button"
                className="Login-googleBtn"
                onClick={() => handleCustomGoogleLogin()}
                disabled={loading}
              >
                <div className="Login-googleIconWrapper">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="Login-googleText">Sign in with Google</span>
              </button>
            </form>

            <div className="Login-divider">
              <span />
              <p>or</p>
              <span />
            </div>

            <p className="Login-register">
              New to PaviKnots? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
