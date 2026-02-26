import React, { useEffect, useState } from "react";
import { registerUser } from "../../store/features/UserSlice";
import { login } from "../../store/features/AuthSlice";
import { useDispatch , useSelector} from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate , useLocation} from "react-router-dom";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const from = location.state?.from?.pathname || "/home";

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [signupStep, setSignupStep] = useState(1); 

  useEffect(() => {
    if (authMode !== "signup") {
      setSignupStep(1);
    }
  }, [authMode]);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [address, setAddress] = useState({
    country: "",
    postalCode: "",
    state: "",
    city: "",
    addressLine: "",
    addressType: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const payload = {
      ...user,
      addressList: [address],
    };
    console.log(payload);
    try {
      await dispatch(registerUser(payload)).unwrap();
      toast.success("Account created successfully!");
      resetForm();
    } catch (err) {
      toast.error(err?.message || "Signup failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast.error("Invalid username or password");
      setErrorMessage("Invalid username or password");
      return;
    }
    try {
     await dispatch(login(credentials)).unwrap();
    } 
    catch (error) {
      toast.error(error?.message || "Login failed");
    }
  };

  const resetForm = () => {
    setUser({
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    });
    setAddress({
      country: "",
      postalCode: "",
      state: "",
      city: "",
      addressLine: "",
      addressType: ""
    });
    setSignupStep(1);
    setAuthMode("login");
  };

  return (
    <div className="landing-page-root">
      <ToastContainer/>
      <div className="landing-container d-flex justify-content-center align-items-center">

        {/* HERO CONTENT */}
        <div className={`hero-section-landing text-center ${showAuth ? "fade-out" : "fade-in"}`}>
          <h1 className="display-4 fw-bold text-white mb-3">
            Discover Your Next Great Read
          </h1>

          <p className="lead text-light mb-4">
            AI-powered search • Personalized shelves • Smart insights
          </p>

          <button
            className="btn btn-light btn-lg px-4 rounded-pill shadow-sm landing-btn"
            onClick={() => setShowAuth(true)}>
            Get Started
          </button>
        </div>

        {/* AUTH FORM CARD */}
        {showAuth && (
          <div className="auth-card fade-in">
            <h3 className="text-white text-center mb-4">
              {authMode === "login" ? "Welcome Back" : "Create an Account"}
            </h3>

            <form onSubmit={authMode === "signup" ? handleSignup : handleLogin}>
              {/*SIGN UP STEP 1*/}
              {authMode === "signup" && signupStep === 1 && (
                <>
                  <div className="mb-3 text-start">
                    <label className="form-label text-white">First Name</label>
                    <input
                      type="text"
                      className="form-control auth-input"
                      placeholder="Enter First Name"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleUserChange}
                      required
                    />
                  </div>

                  <div className="mb-3 text-start">
                    <label className="form-label text-white">Last Name</label>
                    <input
                      type="text"
                      className="form-control auth-input"
                      placeholder="Enter Last Name"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleUserChange}
                      required
                    />
                  </div>

                  <div className="mb-3 text-start">
                    <label className="form-label text-white">Email</label>
                    <input
                      type="email"
                      className="form-control auth-input"
                      placeholder="Enter Email"
                      name="email"
                      value={user.email}
                      onChange={handleUserChange}
                      required
                    />
                  </div>

                  <div className="mb-3 text-start">
                    <label className="form-label text-white">Password</label>
                    <input
                      type="password"
                      className="form-control auth-input"
                      placeholder="Enter Password"
                      name="password"
                      value={user.password}
                      onChange={handleUserChange}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-light w-100 mt-2"
                    onClick={() => setSignupStep(2)}
                  >
                    Continue
                  </button>
                </>
              )}

              {/*SIGN UP STEP 2 (ADDRESS)*/}
              {authMode === "signup" && signupStep === 2 && (
                <>
                  <div className="mb-3 text-start">
                    <label className="form-label text-white">Address Line</label>
                    <input
                      type="text"
                      className="form-control auth-input"
                      placeholder="Street / Apartment"
                      name="addressLine"
                      value={address.addressLine}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className="mb-3 text-start">
                    <label className="form-label text-white">City</label>
                    <input
                      type="text"
                      className="form-control auth-input"
                      placeholder="City"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className="mb-3 text-start">
                    <label className="form-label text-white">State</label>
                    <input
                      type="text"
                      className="form-control auth-input"
                      placeholder="State"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-light w-50"
                      onClick={() => setSignupStep(1)}
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      className="btn btn-light w-50"
                      onClick={() => setSignupStep(3)}
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}

              {/*SIGN UP STEP 3 (ADDRESS - 2)*/}
              {authMode === "signup" && signupStep === 3 && (
                <>
                  <div className="mb-3 text-start">
                    <label className="form-label text-white">Postal Code</label>
                    <input
                      type="number"
                      className="form-control auth-input"
                      placeholder="Postal Code"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className="mb-3 text-start">
                    <label className="form-label text-white">Country</label>
                    <input
                      type="text"
                      className="form-control auth-input"
                      placeholder="Country"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className="mb-3 text-start">
                    <label className="form-label text-white">Address Type</label>
                    <select name="addressType" className="form-control auth-input"
                      placeholder="Address Type" value={address.addressType}
                      onChange={handleAddressChange} required>
                      <option value="">Select Address Type</option>
                      <option value="HOME">Home</option>
                      <option value="OFFICE">Office</option>
                      <option value="SHIPPING">Shipping</option>
                    </select>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-light w-50"
                      onClick={() => setSignupStep(2)}
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="btn btn-light w-50"
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}

              {/*LOGIN*/}
              {authMode === "login" && (
                <>
                  <div className="mb-3 text-start">
                    <label className="form-label text-white">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control auth-input"
                      placeholder="Enter Email"
                      value={credentials.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3 text-start">
                    <label className="form-label text-white">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control auth-input"
                      placeholder="Enter Password"
                      value={credentials.password}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-light w-100 mt-2">
                    Sign In
                  </button>
                </>
              )}
            </form>


            {/* LOGIN / SIGNUP TOGGLE */}
            <p className="text-center mt-4 text-white small">
              {authMode === "login" ? (
                <>
                  Not a member?{" "}
                  <span className="auth-link" onClick={() => setAuthMode("signup")}>
                    Sign up
                  </span>
                </>
              ) : (
                <>
                  Already a member?{" "}
                  <span className="auth-link" onClick={() => setAuthMode("login")}>
                    Log in
                  </span>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
