import React, { useState, useEffect } from "react";
import { auth, db } from '../../firebaseConfig'; // Assuming you have these exports in firebaseConfig
import { getDoc, doc } from "firebase/firestore";
import './OverviewTab.css';

function OverviewTab() {
  const [userData, setUserData] = useState({
    fullName: "",
    company: "",
    job: "",
    country: "",
    address: "",
    phone: "",
    email: ""
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
            setUserData(userDoc.data());
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="tab-pane fade show active profile-overview" id="profile-overview">
      <div className="row">
        <div className="col-lg-3 col-md-4 label">Full Name</div>
        <div className="col-lg-9 col-md-8">{userData.fullName}</div>
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-4 label">Company</div>
        <div className="col-lg-9 col-md-8">{userData.company}</div>
      </div>
     <div className="row">
                    <div className="col-lg-3 col-md-4 label">Job</div>
                    <div className="col-lg-9 col-md-8">{userData.job}</div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-4 label">Country</div>
                    <div className="col-lg-9 col-md-8">{userData.country}</div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-4 label">Address</div>
                    <div className="col-lg-9 col-md-8">
                    {userData.address}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-4 label">Phone</div>
                    <div className="col-lg-9 col-md-8">
                    {userData.phone}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-4 label">Email</div>
                    <div className="col-lg-9 col-md-8">
                    {userData.email}
                    </div>
                  </div>
    </div>
  );
}

export default OverviewTab;
