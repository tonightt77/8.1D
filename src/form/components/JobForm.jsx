import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import CustomInput from "./Input";
import Title from "./Title";
import P from "./P";
import ButtonSubmit from "./SubmitBtn";
import "./skills.css"
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {storage, auth, db} from '../../firebaseConfig';
import ProgressBar from "./ProgressBar";

function MyForm() {
  const [formData, setFormData] = useState({
    radioButton: "",
    position: "",
    description: "",
    skills: "",
    paymentMin: "",
    paymentMax: "",
    projectLength: "",
    paymentMin: "",
    paymentMax: "",
    workingHours: "",
    experience: "",
    period: "",
  });

  const user = auth.currentUser;


  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
};

const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();

  if (user) {
    const uid = user.uid;

    // Create a reference to the jobs collection under the user's UID
    const jobsCollectionRef = collection(db, "jobs");

    // Add the job to this collection
    await addDoc(jobsCollectionRef, {
      ...formData,
      userId: uid,  // associate the job with the user
      imageUrl: url  // save the uploaded image URL to Firestore
    });

    console.log("Job posted successfully");
    alert("Job posted successfully");
    navigate('/find-job');
  } else {
    console.error("No user is logged in");
  }
};

  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e) => {
    e.preventDefault();
    setProgress(0);  // Reset progress bar
    setUploadSuccess(null);  // Reset upload success status
    if (image) {
        const storageRef = ref(storage, 'images/' + image.name);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on('state_changed', 
            (snapshot) => {
                // Progress function ...
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            }, 
            (error) => {
                // Error function ...
                console.log(error);
                setUploadSuccess(false);  // Set upload as failed
            }, 
            () => {
                // Complete function ...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    alert("Image uploaded successfully");
                    setUrl(downloadURL);
                    setUploadSuccess(true);  // Set upload as successful
                });
            }
        );
    } else {
        alert("Please select an image first.");
    }
};


  return (
    <form className="JobForm" onSubmit={handleSubmit}>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "3px solid #e0e0e0"}}>
        <P text="Select job type" />
        <label>
          <input
            type="radio"
            name="radioButton"
            value="Freelance"
            onChange={handleChange}
          />
          Freelance
        </label>
        <label>
          <input
            type="radio"
            name="radioButton"
            value="Employment"
            onChange={handleChange}
          />
          Employment
        </label>
      </div>

      <Title text="Describe your job" />
      <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #e0e0e0" }}>
        <P text="Title/Position" />
        <CustomInput
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #e0e0e0" }}>
        <P text="Job Description" />
        <CustomInput
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          width={600}
          height={80}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <P text="Skills" />
        <CustomInput
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Enter skills separated by commas: Java, JavaScript, Python"
          width={680}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #e0e0e0" }}>
      <P text="Developers will find your job based on the skills you added here." />
      </div>

      <Title text="Project conditions" />

      <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #e0e0e0" }}>
        <P text="Project Length" />
        <CustomInput
          type="text"
          name="projectLength"
          value={formData.projectLength}
          onChange={handleChange}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid #e0e0e0" 
        }}
      >
        <P text="Payment" />
        <P text="Min:" />
        <CustomInput
          type="number"
          name="paymentMin"
          value={formData.paymentMin}
          onChange={handleChange}
        />
        <P text="Max:" />
        <CustomInput
          type="number"
          name="paymentMax"
          value={formData.paymentMax}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #e0e0e0"  }}>
        <P text="Working hours" />
        <CustomInput
          type="number"
          name="workingHours"
          value={formData.workingHours}
          onChange={handleChange}
        />
      </div>
      <P text="Add an image:" />
      <div style={{ display: "flex", alignItems: "center" }}>
        
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      {progress > 0 && (
    <ProgressBar 
        percent={progress} 
        success={uploadSuccess === true ? "success" : (uploadSuccess === false ? "error" : null)} 
        msg={uploadSuccess === true ? "" : (uploadSuccess === false ? "Upload Failed" : "Uploading...")}
    />
)}
      {url && <img src={url} alt="Uploaded Job Image" style={{ width: 'auto', maxHeight: '200px' }} />}  {/* Display the uploaded image */}

      {formData.radioButton === "Employment" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Title text="Experience" />
          <P text="Please select the required experience level for this job." />

          <div style={{ display: "flex", alignItems: "center" }}>
            <P text="Experienced in" />
            <CustomInput
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            />

            <P text="For at least" />
            <CustomInput
              type="text"
              name="period"
              value={formData.period}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ButtonSubmit type="submit" text="POST" width={150} />
      </div>
    </form>
  );
}

export default MyForm;