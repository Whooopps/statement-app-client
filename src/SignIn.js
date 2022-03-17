import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import isEmail from "validator/lib/isEmail";
import { useForm } from "react-hook-form";
import { useNonAuthProtected, useSetAuth } from "./effects/use-auth";
import { useAxios } from "./effects/use-axios";

function SignIn() {
  useNonAuthProtected();
  const setAuth = useSetAuth();
  const axios = useAxios();
  const navigate = useNavigate();
  let [isHidded, setIsHidded] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  async function onSubmit(data) {
    try {
      const response = await axios.post("/login", {
        username: data.email,
        password: data.password,
      });
      localStorage.setItem("token", response.data.accessToken);
      setAuth(true);
      navigate("/");
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
          <h1 className="login">Log In</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div>
            <label htmlFor="email" className="signin-label">
              Email
            </label>
            <div>
              <input
                autoComplete="on"
                className="sigin-input"
                {...register("email", {
                  required: true,
                  validate: {
                    email: (v) => isEmail(v),
                  },
                })}
              />
              {renderError(
                errors.email?.type === "required",
                "Email is Required"
              )}
              {renderError(
                errors.email?.type === "email",
                "Email is Not Valid"
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
                {...register("password", {
                  required: true,
                })}
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
            <button className="btn" disabled={isSubmitting} type="submit">
              Log In
            </button>
          </div>
          <div>
            <Link to="/signup" className="exist-new-user">
              <h4>New User? Sign up!</h4>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignIn;
