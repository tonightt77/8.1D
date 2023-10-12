import React, { useState } from "react";
import {
  updatePassword,
  reauthenticateWithCredential,
  PhoneAuthProvider,
  EmailAuthProvider,
  getMultiFactorResolver,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from "firebase/auth";

import "./ChangePassword.css";
import { auth } from "../../firebaseConfig";

function ChangePasswordTab() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    renewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [isMfaResolved, setIsMfaResolved] = useState(false);

  const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.renewPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        // Reauthenticate the user before updating the password
        const credential = EmailAuthProvider.credential(
          user.email,
          formData.currentPassword
        );
        await reauthenticateWithCredential(user, credential);

        // Update the password
        await updatePassword(user, formData.newPassword);
        alert("Password updated successfully!");
        setIsMfaResolved(false);
      } else {
        alert("No authenticated user found!");
      }
    } catch (error) {
      if (error.code !== "auth/multi-factor-auth-required") {
        setIsMfaResolved(false); // Reset the flag if the error is not related to MFA
      }
      if (error.code === "auth/multi-factor-auth-required") {
        const resolver = getMultiFactorResolver(auth, error);
        const selectedHint = resolver.hints[0];

        const phoneInfoOptions = {
          multiFactorHint: selectedHint,
          session: resolver.session,
        };

        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneAuthProvider.verifyPhoneNumber(
          phoneInfoOptions,
          recaptchaVerifier
        );
        const verificationCode = prompt("Enter the SMS verification code:");
        const cred = PhoneAuthProvider.credential(
          verificationId,
          verificationCode
        );
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

        try {
          await resolver.resolveSignIn(multiFactorAssertion);
          setIsMfaResolved(true);
          handleSubmit(e); // Retry the password update after MFA resolution
        } catch (mfaError) {
          console.error("Error resolving MFA:", mfaError.message);
          alert(mfaError.message);
        }
      } else {
        console.error("Error updating password:", error.message);
        alert(error.message);
      }
    }
  };
  

  return (
    <div
      className="tab-pane fade profile-change-password"
      id="profile-change-password"
    >
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <label
            htmlFor="currentPassword"
            className="col-md-4 col-lg-3 col-form-label"
          >
            Current Password
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="currentPassword"
              type="password"
              className="form-control"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label
            htmlFor="newPassword"
            className="col-md-4 col-lg-3 col-form-label"
          >
            New Password
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="newPassword"
              type="password"
              className="form-control"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label
            htmlFor="renewPassword"
            className="col-md-4 col-lg-3 col-form-label"
          >
            Re-enter New Password
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="renewPassword"
              type="password"
              className="form-control"
              id="renewPassword"
              value={formData.renewPassword}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Change Password
          </button>
        </div>
        <div id="recaptcha-container"></div>
      </form>
    </div>
  );
}

export default ChangePasswordTab;
