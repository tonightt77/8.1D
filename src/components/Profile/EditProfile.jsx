import React, { useState, useEffect } from "react";
import { Icon } from "semantic-ui-react";
import { auth, db, storage } from '../../firebaseConfig';
import { getDoc, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./EditProfile.css";

function EditProfileTab() {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    job: "",
    country: "",
    address: "",
    phone: "",
    email: "",
    twitter: "https://twitter.com/#",
    facebook: "https://facebook.com/#",
    instagram: "https://instagram.com/#",
    linkedin: "https://linkedin.com/#"
  });

  const [profileImageUrl, setProfileImageUrl] = useState("images/user.png"); // Default image URL
  const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
        setSelectedImage(e.target.files[0]);
        const tempImageUrl = URL.createObjectURL(e.target.files[0]);
        setProfileImageUrl(tempImageUrl);
    }
};


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
            setProfileImageUrl(data.profileImageUrl || "images/user.png"); // Use default image if not available
            setFormData({
              fullName: data.fullName || "",
              company: data.company || "",
              job: data.job || "",
              country: data.country || "",
              address: data.address || "",
              phone: data.phone || "",
              email: data.email || "",
              twitter: data.twitter || "https://twitter.com/#",
              facebook: data.facebook || "https://facebook.com/#",
              instagram: data.instagram || "https://instagram.com/#",
              linkedin: data.linkedin || "https://linkedin.com/#"
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchData();
  }, []);


  const handleUpload = async (e) => {
    e.preventDefault();

    if (selectedImage) {
        const storageRef = ref(storage, 'images/' + selectedImage.name);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

        uploadTask.on('state_changed', 
            (snapshot) => {
                // Progress function ...
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log(`Upload is ${progress}% done`);
            }, 
            (error) => {
                // Error function ...
                console.error("Error uploading image:", error.message);
            }, 
            async () => {
                // Complete function ...
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('File available at', downloadURL);
                    setProfileImageUrl(downloadURL); // Update the state with the new image URL

                    // Save the image URL to Firestore
                    const user = auth.currentUser;
                    if (user) {
                        const uid = user.uid;
                        await setDoc(doc(db, "user profile", uid), {
                            profileImageUrl: downloadURL
                        }, { merge: true }); // Use merge: true to only update the profileImageUrl field
                    }

                    alert("Image uploaded successfully");
                } catch (error) {
                    console.error("Error getting download URL:", error);
                }
            }
        );
    } else {
        alert("Please select an image first.");
    }
};


const handleRemoveImage = () => {
  setProfileImageUrl("images/user.png"); // Set to default image
  const user = auth.currentUser;
  if (user) {
      const uid = user.uid;
      setDoc(doc(db, "user profile", uid), {
          profileImageUrl: "images/user.png"
      }, { merge: true });
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        await setDoc(doc(db, "user profile", uid), formData);
        alert("Profile saved successfully!");
      } else {
        alert("No authenticated user found!");
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <div className="tab-pane fade profile-edit" id="profile-edit">
      <form onSubmit={handleSaveChanges}>
      <div className="row mb-3">
            <label
              htmlFor="profileImage"
              className="col-lg-3 col-md-4 label"
            >
              Profile Image
            </label>
            <div className="col-md-8 col-lg-9">
            <img src={profileImageUrl} alt="Profile" />

              <div className="pt-2">
              <input 
                type="file" 
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
            />
            <a
              href="#"
              className="btn btn-secondary btn-sm"
              title="Choose an image"
              onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('input[type="file"]').click(); // Trigger the file input
              }}
            >
              Choose File
            </a>
                <a
                  href="#"
                  className="btn btn-primary btn-sm"
                  title="Upload new profile image"
                  onClick={handleUpload}
                >
                  <Icon name="upload" />
                </a>
                <a
                  href="#"
                  className="btn btn-danger btn-sm"
                  title="Remove my profile image"
                  onClick={handleRemoveImage}
                >
                  <Icon name="trash alternate" />
                </a>
              </div>
            </div>
          </div>
        <div className="row mb-3">
          <label htmlFor="fullName" className="col-lg-3 col-md-4 label">
            Full Name
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="fullName"
              type="text"
              className="form-control"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="company" className="col-lg-3 col-md-4 label">
            Company
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="company"
              type="text"
              className="form-control"
              id="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="Job" className="col-lg-3 col-md-4 label">
            Job
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="job"
              type="text"
              className="form-control"
              id="Job"
              value={formData.job}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="Country" className="col-lg-3 col-md-4 label">
            Country
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="country"
              type="text"
              className="form-control"
              id="Country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="Address" className="col-lg-3 col-md-4 label">
            Address
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="address"
              type="text"
              className="form-control"
              id="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="Phone" className="col-lg-3 col-md-4 label">
            Phone
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="phone"
              type="text"
              className="form-control"
              id="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="Email" className="col-lg-3 col-md-4 label">
            Email
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="email"
              type="email"
              className="form-control"
              id="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="Twitter" className="col-lg-3 col-md-4 label">
            Twitter Profile
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="twitter"
              type="text"
              className="form-control"
              id="Twitter"
              value={formData.twitter}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="Facebook" className="col-lg-3 col-md-4 label">
            Facebook Profile
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="facebook"
              type="text"
              className="form-control"
              id="Facebook"
              value={formData.facebook}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="Instagram" className="col-lg-3 col-md-4 label">
            Instagram Profile
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="instagram"
              type="text"
              className="form-control"
              id="Instagram"
              value={formData.instagram}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="Linkedin" className="col-lg-3 col-md-4 label">
            Linkedin Profile
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              name="linkedin"
              type="text"
              className="form-control"
              id="Linkedin"
              value={formData.linkedin}
              onChange={handleChange}
            />
          </div>
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

export default EditProfileTab;
