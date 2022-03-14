import React, { useState } from "react";
import { Link } from "react-router-dom";

function SignIn() {
  const [isHidded, setIsHidded] = useState(true);
  return (
    <>
      <div className="flex-container">
        <div>
          <h1 className="login">Log In</h1>
        </div>
        <form action="" className="form">
          <div>
            <label htmlFor="email" className="signin-label">
              Email
            </label>
            <div>
              <input
                type="text"
                name="email"
                id="email"
                className="sigin-input"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="signin-label">
              Password
            </label>
            <div>
              <input
                type={isHidded ? "password" : "text"}
                name="password"
                id="password"
                className="sigin-input"
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
            </div>
          </div>
          <div className="btn-box">
            <button className="btn">Sign In</button>
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
