import React, { useState } from "react";

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
        </form>
      </div>
    </>
  );
}

export default SignIn;
