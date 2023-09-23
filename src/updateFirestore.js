import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function tokenizeFieldsAndUpdate() {
  try {
    // Fetch all job documents from the 'jobs' collection
    const jobsRef = collection(db, 'jobs');
    const snapshot = await getDocs(jobsRef);

    // Iterate over each job document and update it
    const updatePromises = snapshot.docs.map(async (docSnapshot) => {
      const jobData = docSnapshot.data();

      // Tokenize the 'title' field by spaces
      const titleTokens = jobData.position.split(/\s+/);

      // Tokenize the 'skills' field by commas and trim any leading/trailing whitespace from each token
      const skillsTokens = jobData.skills.split(',').map(skill => skill.trim());

      // Update the document with the new 'titleTokens' and 'skillsTokens' fields
      const docRef = doc(db, 'jobs', docSnapshot.id);
      return updateDoc(docRef, {
        titleTokens,
        skillsTokens,
      });
    });

    // Wait for all update operations to complete
    await Promise.all(updatePromises);
    console.log('All job documents have been updated.');
  } catch (error) {
    console.error('Error updating documents:', error);
  }
}

// Run the function
//tokenizeFieldsAndUpdate();
