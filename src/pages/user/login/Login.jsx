import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import "./Login.css";
import { useAuth } from "../../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

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

  const googleButtonRef = useRef(null);
  const [googleButtonWidth, setGoogleButtonWidth] = useState(900);

  useEffect(() => {
    const container = googleButtonRef.current;

    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setGoogleButtonWidth(Math.floor(entry.contentRect.width));
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

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
      console.error("Google authentication failed:", error.response?.data);

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
      console.error("Login failed:", error.response?.data || error.message);

      toast.error(
        error.response?.data?.message ||
          "Unable to sign in. Please check your email and password.",
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
            </form>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google sign-in failed.")}
              theme="outline"
              text="signin_with"
              shape="rectangular"
              size="large"
              width={String(googleButtonWidth)}
            />

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
