import React, { useEffect, useState, useRef } from 'react';
import { multiFactor , PhoneAuthProvider, PhoneMultiFactorGenerator, RecaptchaVerifier  } from "firebase/auth";
import { auth } from '../../firebaseConfig';
import "./Settings.css";

function SettingsTab() {

  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+61427211111'); // Default phone number for testing

  const handleMFAChange = (e) => {
    setIsMFAEnabled(e.target.checked);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const recaptchaVerifierRef = useRef(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let user = auth.currentUser;

    if (isMFAEnabled) {
        // Initialize reCAPTCHA only if it hasn't been initialized yet
        if (!recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible'
            });
        }

        try {
            await user.reload();
            user = auth.currentUser;

            const multiFactorSession = await multiFactor(user).getSession();

            const phoneInfoOptions = {
                phoneNumber: phoneNumber, // Use the phone number from the state
                session: multiFactorSession
            };

            const phoneAuthProvider = new PhoneAuthProvider(auth);
            const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifierRef.current);

            // Prompt the user to enter the SMS verification code
            const verificationCode = prompt('Please enter the verification code that was sent to your mobile device.');
            const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

            // Enroll the user in MFA
            await multiFactor(user).enroll(multiFactorAssertion, 'Phone'); // 'Phone' is the display name for this MFA method
            alert('MFA enrollment is successful!');
            //console.log('User enrolled in MFA with phone.');

        } catch (error) {
            console.error("Error during MFA enrollment:", error);
        }

    } else {
        // for disabling MFA
        try {
          await user.reload();
          user = auth.currentUser;

          // Get the enrolled factors for the user
          const enrolledFactors = multiFactor(user).enrolledFactors;

          // Find the phone factor and unenroll the user from it
          for (const factor of enrolledFactors) {
                  await multiFactor(user).unenroll(factor);
                  //console.log('User unenrolled from phone MFA.');
                  alert('MFA unenrollment is successful!');
                  break; // Exit the loop once the phone factor is found and unenrolled
              
          }

      } catch (error) {
          console.error("Error during MFA unenrollment:", error);
      }
  }
};

  
useEffect(() => {
  console.log("Checking MFA status...");

  const fetchMFAStatus = async () => {
    try {
      const user = auth.currentUser;
      console.log("Current user:", user); // Log the current user

      if (user) {
        await user.reload();
        //console.log("Reloaded user data:", user); // Log the reloaded user data
        //console.log("Full user object:", user);

        if (multiFactor(user) && multiFactor(user).enrolledFactors) {
          const enrolledFactors = multiFactor(user).enrolledFactors;
          console.log("User multiFactor property:", multiFactor(user));

          if (enrolledFactors.some(factor => factor.factorId === 'phone')) {
            setIsMFAEnabled(true);
            console.log("MFA is enabled");
          } else {
            setIsMFAEnabled(false);
            console.log("MFA is not enabled");
          }
        } else {
          setIsMFAEnabled(false);
          console.log("User does not have multiFactor property or is not logged in");
        }
      } else {
        setIsMFAEnabled(false);
        console.log("No authenticated user");
      }
    } catch (error) {
      console.error("Error fetching MFA status:", error);
    }
  };

  fetchMFAStatus();
}, []);



  return (
    <div className="tab-pane fade profile-settings" id="profile-settings">
      <form onSubmit={handleFormSubmit}>
        <div className="row mb-3">
          <label
            htmlFor="fullName"
            className="col-md-4 col-lg-3 col-form-label"
          >
            Email Notifications
          </label>

          <div className="col-md-8 col-lg-9">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="changesMade"
                defaultChecked=""
              />
              <label className="form-check-label" htmlFor="changesMade">
                Changes made to your account
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="newProducts"
                defaultChecked=""
              />
              <label className="form-check-label" htmlFor="newProducts">
                Information on new products and services
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="proOffers"
              />
              <label className="form-check-label" htmlFor="proOffers">
                Marketing and promo offers
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="securityNotify"
                defaultChecked=""
                disabled=""
              />
              <label className="form-check-label" htmlFor="securityNotify">
                Security alerts
              </label>
            </div>
          </div>
        </div>
        {/* New row for Security */}
        <div className="row mb-3">
          <label className="col-md-4 col-lg-3 col-form-label">Security</label>
          <div className="col-md-8 col-lg-9">
            <div className="form-check">

              <input
                className="form-check-input"
                type="checkbox"
                id="mfaVerification"
                checked={isMFAEnabled}
                onChange={handleMFAChange}
              />
              <label className="form-check-label" htmlFor="mfaVerification">
                MFA Verification(SMS)
              </label>
            </div>
            {/* Display current phone number if MFA is enabled */}
            {isMFAEnabled && (
              <p>Current MFA Phone Number: {phoneNumber}</p>
            )}
            {/* Conditionally render phone number input based on isMFAEnabled */}
    {isMFAEnabled && (
      <>
        <div className="mt-2">
          <label htmlFor="phoneNumber">Phone Number: </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter your phone number"
          />
        </div>
      </>
    )}
          </div>
          <div id='recaptcha-container'></div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsTab;
