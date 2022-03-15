import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNonAuthProtected } from "./effects/use-auth";
import { useAxios } from "./effects/use-axios";
import { useForm } from "react-hook-form";
import { useAlert } from "react-alert";
import isEmail from "validator/lib/isEmail";
import AwesomeDebouncePromise from "awesome-debounce-promise";

function SignUp() {
  useNonAuthProtected();
  const axios = useAxios();
  const [isHidded, setIsHidded] = useState(true);
  const alert = useAlert();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });
  const navigate = useNavigate();

  async function validateEmail(value) {
    try {
      const response = await axios.post("http://127.0.0.1:8000/checkemail", {
        email: value,
      });
      return response.data.valid || "Email is already taken";
    } catch (err) {
      console.log(err);
      return err.message;
    }
  }

  async function onSubmit(data) {
    try {
      const response = await axios.post("http://127.0.0.1:8000/users", {
        email: data.email,
        password: data.password,
      });
      navigate("/signin");
      alert.success(
        "Signed up successfully. Please log in with your credentials."
      );
    } catch (err) {
      console.log(err);
    }
  }

  function renderError(condition, message) {
    if (condition) {
      return <p style={{ color: "red" }}>{message}</p>;
    }
    return null;
  }

  return (
    <>
      <div className="flex-container">
        <div>
          <h1 className="login">Sign Up</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div>
            <label htmlFor="email" className="signin-label">
              Email
            </label>
            <div>
              <input
                className="sigin-input"
                {...register("email", {
                  required: true,
                  validate: {
                    email: (v) => isEmail(v),
                    uniqueEmail: AwesomeDebouncePromise(validateEmail, 150),
                  },
                })}
              />
              {renderError(
                errors.email?.type === "required",
                "Email is required"
              )}
              {renderError(
                errors.email?.type === "email",
                "Email is not valid"
              )}
              {renderError(
                errors.email?.type === "uniqueEmail",
                errors.email?.message
              )}
            </div>
          </div>
          <div>
            <label htmlFor="password" className="signin-label">
              Password
            </label>
            <div>
              <input
                type={isHidded ? "password" : "text"}
                className="sigin-input"
                {...register("password", { required: true })}
              />
              {isHidded ? (
                <i
                  className="fa fa-eye eye"
                  aria-hidden="true"
                  onClick={() => setIsHidded(!isHidded)}
                ></i>
              ) : (
                <i
                  className="fa fa-eye-slash eye"
                  aria-hidden="true"
                  onClick={() => setIsHidded(!isHidded)}
                ></i>
              )}
              {renderError(
                errors.password?.type === "required",
                "Password is required"
              )}
            </div>
          </div>
          <div className="btn-box">
            <button className="btn" disabled={isSubmitting}>
              Sign Up
            </button>
          </div>
          <div>
            <Link to="/signin" className="exist-new-user">
              <h4>Existing User? Sign in!</h4>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUp;
