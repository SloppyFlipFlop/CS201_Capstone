import React, { useState, useEffect } from "react";
import "../../styles/components/auth/Signin.scss";
import Input from "../form/Input";
import {
  FaApple,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaFacebookF,
  FaGoogle,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import { useUser } from "../../contexts/useUser";

import { Link } from "react-router-dom";

const Signin = ({ close, change }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isLoginError, setIsLoginError] = useState({
    status: false,
    message: "",
  });

  const { user, dispatch } = useUser();
  // FORM VALIDATION STILL NEEDS TO BE DONE. (IE. PASSWORD IS INNCORRECT OR NAME IS TOO LONG)
  // IF YOU NEED HELP WITH THIS CONTACT ETHAN
  const formSubmit = async (e) => {
    e.preventDefault();
    // const { target } = e;

    // setError("some error triggered when form validation is failed")
    // To chnage styles

    if (userEmail === "" || userPassword === "") {
      //   setError("Please fill out all fields");
      // console.log("Please fill out all fields");
    } else {
      // console.log("userEmail", userEmail);
      // console.log("userPassword", userPassword);

      const response = await axios
        .post("http://localhost:3000/api/v1/auth/login", {
          email: userEmail,
          password: userPassword,
        })
        .then((response) => {
          dispatch({ type: "LOGIN", payload: response.data });

          setIsLoginError({ status: false, message: "" });

          // if (isLoginError.status === false) {
          close();
          // }
        })
        .catch((err) => {
          if (err.response) {
            // client received an error response (5xx, 4xx)
            setIsLoginError({
              status: true,
              message: "Invalid email and/or password", //err.response.data.message,
            });
            // console.log(err.response.data);
            // console.log(err.response.status);
            // console.log(err.response.headers);

            // console.log(err.response);
          } else if (err.request) {
            // client never received a response, or request never left
          } else {
            // anything else
          }
        });

      // const token = response.data.token;
      // localStorage.clear();
      //   stores token in local storage
      // localStorage.setItem("userToken", token);
      // console.log(token);
    }

    // Do whatever you need with the form data
    // console.log(userEmail, userPassword);
  };

  // The valid provider names are "google", "facebook", or "apple"
  // Feel free to disassemble and reassemble however you'd like
  const provider = (name) => {
    // Do whatever you need to do with the providers
  };

  return (
    <div className="signin-popup">
      <div className="darken" onClick={close}></div>
      <div className="content">
        <div className="title">
          <h2>Sign In</h2>
          <div className="switch" onClick={change}>
            Register
          </div>
          <div className="cancel-icon" onClick={close}>
            <FaTimes />
          </div>
        </div>

        {isLoginError.status ? (
          <div className="error-message">{isLoginError.message}</div>
        ) : null}

        <form onSubmit={formSubmit}>
          <div className="traditional">
            <Input
              name="email"
              placeholder="example@gmail.com"
              onChange={(e) => setUserEmail(e.target.value)}
              icon={<FaEnvelope />}
            />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setUserPassword(e.target.value)}
              icon={
                showPassword ? (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                )
              }
            />
          </div>

          <div className="forgot-password">Forgot Your Password?</div>

          <button
            type="submit"
            onClick={(e) => {
              formSubmit(e);
              // close();
            }}
          >
            Login
          </button>

          <p className="signin-info">
            By clicking Sign in, you agree to MSB's{" "}
            <Link className="link" to={`/terms-of-use`}>
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link className="link" to="/privacy-policy">
              Privacy Policy
            </Link>
            . MSB may send you communications; you may change your preferences
            in your account settings. We'll never post without your permission.
          </p>

          {/* <div className="sep">
            <div className="dash"></div>
            <span>or</span>
            <div className="dash"></div>
          </div> */}

          {/* <div className="with">
            <div className="google" onClick={() => provider("google")}>
              <FaGoogle />
              <span>Contuine with Google</span>
            </div>
            <div className="facebook" onClick={() => provider("facebook")}>
              <FaFacebookF />
              <span>Contuine with Facebook</span>
            </div>
            <div className="apple" onClick={() => provider("apple")}>
              <FaApple />
              <span>Contuine with Apple</span>
            </div>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Signin;
