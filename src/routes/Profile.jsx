import React, { useState, useEffect } from "react";
import { Button, Divider } from "semantic-ui-react";
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import OverviewTab from "../components/Profile/OverviewTab";
import EditProfileTab from "../components/Profile/EditProfile";
import SettingsTab from "../components/Profile/Settings";
import ChangePasswordTab from "../components/Profile/ChangePassword";

import "../styles/Profile.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState({
    profileImage: "images/user.png", // Default image
    name: "" // Default name
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const uid = user.uid;
          const userDocRef = doc(db, "user profile", uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfileData({profileImage: data.profileImageUrl || "images/user.png",
            name: data.fullName || data.email || ""
          }); 
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="main">
      <div className="pagetitle">
        <h1>Profile</h1>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-xl-4">
            {/* Profile Card */}
            <div className="card profile-card">
              <div className="card-body">
                <img
                  src={profileData.profileImage} // Use the profileData state for the image source
                  alt="Profile"
                  className="rounded-circle"
                />
                <h2>{profileData.name}</h2>
                <h3>Community Member</h3>
                <div className="social-links">
                  <a href="#" className="twitter">
                    <i className="bi bi-twitter" />
                  </a>
                  <a href="#" className="facebook">
                    <i className="bi bi-facebook" />
                  </a>
                  <a href="#" className="instagram">
                    <i className="bi bi-instagram" />
                  </a>
                  <a href="#" className="linkedin">
                    <i className="bi bi-linkedin" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div />
          <div className="col-xl-8">
            <div className="card">
              <div className="card-body">
                {/* Navbar */}
                <Button.Group widths="4">
                  <Button
                    active={activeTab === "overview"}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </Button>
                  <Button
                    active={activeTab === "edit"}
                    onClick={() => setActiveTab("edit")}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    active={activeTab === "settings"}
                    onClick={() => setActiveTab("settings")}
                  >
                    Settings
                  </Button>
                  <Button
                    active={activeTab === "password"}
                    onClick={() => setActiveTab("password")}
                  >
                    Change Password
                  </Button>
                </Button.Group>

                <div className="tab-content">
                  {activeTab === "overview" && <OverviewTab />}
                  {activeTab === "edit" && <EditProfileTab />}
                  {activeTab === "settings" && <SettingsTab />}
                  {activeTab === "password" && <ChangePasswordTab />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
