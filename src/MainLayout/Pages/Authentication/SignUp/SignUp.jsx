// File path__
import "./SignUp.css";
import useAxios from "../../../../Hooks/Axios";
import logo from "../../../../assets/companyLogo.png";
import { AuthContext } from "../../../../Context/AuthContext";
import { jhError, jhInfo, jhToastSuccess } from "../../../../utils";

// From react__
import { useContext, useState } from "react";

// Package(REACT ICONS, REACT HOOK FROM, GOOGLE RECAPTCHA, SWEET ALERT)__
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import { FcCheckmark } from "react-icons/fc";
import ReCAPTCHA from "react-google-recaptcha";
import { HiOutlineInformationCircle } from "react-icons/hi";
import {
  FaUserTie,
  FaBuilding,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

const sitekey = import.meta.env.VITE_SITE_KEY;

const SignUp = () => {
  const navigate = useNavigate();
  const api = useAxios();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [robotError, setRobotError] = useState("");
  const [googleBtnOff, setGoogleBtnOff] = useState(false);
  const { handleCreateUser, handleGoogleSignIn, firebaseLoading } =
    useContext(AuthContext);

  // How use know us__
  const options = [
    "Social Media",
    "Friend or Family",
    "Google / Search Engine",
    "Randomly",
  ];

  // User role__
  const roles = [
    {
      name: "Job Seeker",
      tip: "Create your profile, apply for jobs, and track your applications.",
      icon: FaUserTie,
    },
    {
      name: "Recruiter",
      tip: "Post job listings, review applications, and find top talent.",
      icon: FaBuilding,
    },
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // Google recaptcha__
  const handleCaptcha = (value) => {
    setCaptchaValue(value);
    setRobotError("");
  };

  // React hook form state__
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!captchaValue) {
      setRobotError("Please confirm you're not a robot");
      return;
    }

    const email = data.email;
    const password = data.password;
    // Generate random name__
    const firstLetter = "user";
    const number = Math.floor(1000 + Math.random() * 9000);

    const companyData = {
      hearFrom: selected,
      userRole: selectedRole,
      userEmail: email,
      companyName: "Company" + number,
      companyLogo: "",
      companyWebsite: "",
      bio: "",
      industry: "",
      companySize: {
        currentEmployees: null,
        sizeRange: "",
      },
      foundedYear: null,
      headquarters: {
        country: "",
        city: "",
        area: "",
      },
      branchLocations: [
        {
          country: "",
          city: "",
          area: "",
        },
      ],
      description: "",
      mission: "",
      vision: "",
      departments: [],
      companyGallery: [],
      keyPeople: [],
      activeHire: true,
      verified: "Unverified",
      social: {
        linkedin: "",
        x: "",
        additionalLinks: [],
      },
    };

    const userData = {
      hearFrom: selected,
      userRole: selectedRole,
      userEmail: email,
      userName: firstLetter + number,
      profilePhoto: "",
      headline: "",
      bio: "",
      education: [],
      experience: [],
      skills: [],
      certifications: [],
      projects: [],
      social: {
        linkedin: "",
        github: "",
        portfolio: "",
      },
      languages: [],
      location: {
        city: "",
        country: "",
      },
      openToWork: true,
    };

    try {
      await handleCreateUser(email, password);
      const res = await api.post(
        "/user-api/new-user-data",
        selectedRole === "Job Seeker" ? userData : companyData
      );

      if (res.data.insertedId) {
        navigate("/");
        jhToastSuccess("Sign up successfully");

        if (selectedRole === "Job Seeker") {
          setTimeout(() => {
            jhInfo({
              title: "Welcome to Job Hunting",
              text: "Tip: A fully completed profile increases your chances of getting noticed by recruiters. Add your skills, experience, and a professional photo to make the best impression!",
            });
          }, 5000);
        }
      }
    } catch {
      jhError({
        title: "Sign Up Failed",
        text: "There was an issue creating your account. Please try again!",
      });
    }

    setRobotError("");
  };

  const handleGoogleLogin = async () => {
    setGoogleBtnOff(true);
    await handleGoogleSignIn()
      .then((res) => {
        if (res) {
          setGoogleBtnOff(false);
          navigate("/");
        }
      })
      .catch(() => {
        setGoogleBtnOff(false);
      });
  };

  return (
    <>
      <section id="su_main_signUp_container">
        <div className="su_signUp_container">
          {/* Progress Bar - Compact Version */}
          <div className="su_progress_container">
            <div className="su_step_indicators">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="su_step_indicator_wrapper">
                  <div
                    className={`su_step_indicator ${
                      step >= stepNum ? "su_active" : ""
                    }`}
                  >
                    {step >= stepNum && (
                      <FaCheckCircle className="su_step_check_icon" />
                    )}
                  </div>
                  {stepNum < 4 && (
                    <div
                      className={`su_step_connector ${
                        step > stepNum ? "su_active" : ""
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="su_step_labels">
              <span className={step >= 1 ? "su_active" : ""}>Method</span>
              <span className={step >= 2 ? "su_active" : ""}>Discovery</span>
              <span className={step >= 3 ? "su_active" : ""}>Role</span>
              <span className={step >= 4 ? "su_active" : ""}>Account</span>
            </div>
          </div>

          <div className="su_signUp_content_wrapper">
            <div className="su_signUp_form_section">
              <div
                className="su_form_slider"
                style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
              >
                {/* Step 1: Sign Up Method */}
                <div className="su_form_step">
                  <div className="su_step_content_centered">
                    <h1>Join JobHunting</h1>
                    <p>Choose your preferred sign up method</p>

                    <div className="su_signup_methods_compact">
                      <button
                        type="button"
                        disabled={googleBtnOff}
                        onClick={handleGoogleLogin}
                        className="su_method_btn_compact su_google_btn"
                      >
                        <FcGoogle className="su_method_icon" />
                        <span>Continue with Google</span>
                        {googleBtnOff && (
                          <div className="su_loading_spinner su_small"></div>
                        )}
                      </button>

                      <div className="su_divider_compact">
                        <span>or</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="su_method_btn_compact su_email_btn"
                      >
                        <span>Continue with Email</span>
                        <FaArrowRight className="su_arrow_icon" />
                      </button>
                    </div>

                    <div className="su_step_tips_compact">
                      <div className="su_tip_item">
                        <HiOutlineInformationCircle className="su_tip_icon" />
                        <span>
                          <strong>Job Seekers:</strong> Sign up to apply for
                          jobs and track applications
                        </span>
                      </div>
                      <div className="su_tip_item">
                        <HiOutlineInformationCircle className="su_tip_icon" />
                        <span>
                          <strong>Recruiters:</strong> Choose recruiter role
                          when signing up with email
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: How did you hear about us */}
                <div className="su_form_step">
                  <div className="su_step_content_centered">
                    <h1>How did you find us?</h1>
                    <p>Tell us how you discovered JobHunting</p>

                    <div className="su_options_grid_compact">
                      {options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`su_option_btn ${
                            selected === option ? "su_selected" : ""
                          }`}
                          onClick={() => setSelected(option)}
                        >
                          <span>{option}</span>
                          {selected === option && (
                            <FcCheckmark className="su_check_icon" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step 3: Choose Role */}
                <div className="su_form_step">
                  <div className="su_step_content_centered">
                    <h1>Choose Your Role</h1>
                    <p>Select how you'll be using JobHunting</p>

                    <div className="su_role_selection_compact">
                      {roles.map((role) => {
                        const RoleIcon = role.icon;
                        return (
                          <button
                            key={role.name}
                            type="button"
                            className={`su_role_btn ${
                              selectedRole === role.name ? "su_selected" : ""
                            }`}
                            onClick={() => setSelectedRole(role.name)}
                          >
                            <div className="su_role_btn_content">
                              <RoleIcon className="su_role_btn_icon" />
                              <div className="su_role_btn_text">
                                <strong>{role.name}</strong>
                                <span>{role.tip}</span>
                              </div>
                              {selectedRole === role.name && (
                                <FcCheckmark className="su_role_check_icon" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Step 4: Email & Password */}
                <div className="su_form_step">
                  <div className="su_step_content_centered">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="su_final_form_compact"
                    >
                      <h1>Create Your Account</h1>
                      <p>Enter your email and secure password</p>

                      <div className="su_form_inputs_compact">
                        <div className="su_input_group">
                          <input
                            type="email"
                            placeholder="Enter your email address"
                            className="su_form_input"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                              },
                            })}
                          />
                          {errors.email && (
                            <span className="su_error_message">
                              {errors.email.message}
                            </span>
                          )}
                        </div>

                        <div className="su_input_group">
                          <input
                            type="password"
                            placeholder="Create a strong password"
                            className="su_form_input"
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 6,
                                message:
                                  "Password must be at least 6 characters",
                              },
                              pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z]).*$/,
                                message:
                                  "Include at least one uppercase and lowercase letter",
                              },
                            })}
                          />
                          {errors.password && (
                            <span className="su_error_message">
                              {errors.password.message}
                            </span>
                          )}
                        </div>

                        <div className="su_input_group">
                          <input
                            type="password"
                            placeholder="Confirm your password"
                            className="su_form_input"
                            {...register("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) => {
                                if (watch("password") !== value) {
                                  return "Passwords do not match";
                                }
                              },
                            })}
                          />
                          {errors.confirmPassword && (
                            <span className="su_error_message">
                              {errors.confirmPassword.message}
                            </span>
                          )}
                        </div>

                        <div className="su_captcha_container">
                          <ReCAPTCHA
                            sitekey={sitekey}
                            onChange={handleCaptcha}
                          />
                          {robotError && (
                            <span className="su_error_message">
                              {robotError}
                            </span>
                          )}
                        </div>

                        <div className="su_terms_container">
                          <label className="su_terms_checkbox">
                            <input
                              type="checkbox"
                              {...register("terms", {
                                required:
                                  "You must accept the terms and conditions",
                              })}
                              className="su_checkbox_input"
                            />
                            <span className="su_custom_checkbox"></span>
                            <span className="su_terms_text">
                              I agree to the{" "}
                              <a href="#" className="su_terms_link">
                                Terms & Conditions
                              </a>
                            </span>
                          </label>
                          {errors.terms && (
                            <span className="su_error_message">
                              {errors.terms.message}
                            </span>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={firebaseLoading}
                          className="su_submit_btn"
                        >
                          {firebaseLoading ? (
                            <>
                              <div className="su_loading_spinner"></div>
                              Creating Account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Redesigned Sidebar */}
            <div className="su_signUp_sidebar">
              <div className="su_sidebar_content_centered">
                <div className="su_sidebar_header">
                  <img
                    src={logo}
                    alt="JobHunting"
                    className="su_sidebar_logo"
                  />
                  <h3>Start Your Journey Today</h3>
                </div>
                <div className="su_sidebar_features">
                  <div className="su_feature_item">
                    <FaCheckCircle className="su_feature_icon" />
                    <div className="su_feature_content">
                      <strong>Smart Job Matching</strong>
                      <span>Find opportunities that match your skills</span>
                    </div>
                  </div>
                  <div className="su_feature_item">
                    <FaCheckCircle className="su_feature_icon" />
                    <div className="su_feature_content">
                      <strong>Secure Platform</strong>
                      <span>Your data is protected and private</span>
                    </div>
                  </div>
                  <div className="su_feature_item">
                    <FaCheckCircle className="su_feature_icon" />
                    <div className="su_feature_content">
                      <strong>Instant Updates</strong>
                      <span>Get notified about relevant opportunities</span>
                    </div>
                  </div>
                </div>
                <div className="su_sidebar_stats">
                  <div className="su_stat_item">
                    <strong>10K+</strong>
                    <span>Jobs Posted</span>
                  </div>
                  <div className="su_stat_item">
                    <strong>5K+</strong>
                    <span>Companies</span>
                  </div>
                  <div className="su_stat_item">
                    <strong>50K+</strong>
                    <span>Professionals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="su_navigation_buttons">
            <button
              type="button"
              disabled={step === 1}
              onClick={handleBack}
              className="su_nav_btn su_back_btn"
            >
              <FaArrowLeft className="su_nav_icon" />
              Previous
            </button>

            {step !== 4 && step > 1 && (
              <button
                type="button"
                disabled={
                  (step === 2 && selected === "") ||
                  (step === 3 && selectedRole === "")
                }
                onClick={handleNext}
                className="su_nav_btn su_next_btn"
              >
                Next
                <FaArrowRight className="su_nav_icon" />
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;