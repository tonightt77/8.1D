import React from "react";
import NewJob from "../form/NewJob";
import { useAuth } from "../AuthContext";
import Button from "../components/HomeButton";
import { Link } from "react-router-dom";

import "../styles/FindDevMessage.css";

const FindDev = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div>
      {isLoggedIn ? (
        <NewJob />
      ) : (
        <div className="authentication-message">
          <img
            src="https://cdn.discordapp.com/attachments/1149029549703704576/1154300448610734112/tonight77_A_curious_cartoon_animal_peeking_from_behind_a_digita_dc782bbd-f9d7-4709-9a70-ca3a044b72b7.png"
            alt="Please login first!"
          />
          <div className="authentication-message-content">
            <h3>Message</h3>
            <h1>Authentication Required</h1>
            <p>Please login first!</p>
            <Link to="/login">
              <Button name="Login" iconName="sign-in">
                Login
              </Button>
            </Link>

            <br />
            <Link to="/">
              <Button name="Home Page" iconName="home"></Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindDev;
