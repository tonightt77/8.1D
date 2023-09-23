import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import JobCard from './components/JobCard';
import './components/JobList.css';
import { Button, Icon } from 'semantic-ui-react';
import Filter from '../components/Filter';
import SearchInput from '../components/SearchInput';


function JobList() {
  const [jobs, setJobs] = useState([]);
  const [lastDoc, setLastDoc] = useState(null); // For pagination
  const [searchOption, setSearchOption] = useState('title'); // For selected option
  const [searchQuery, setSearchQuery] = useState(''); // For search query
  const [expandedCardId, setExpandedCardId] = useState(null);

  const [hiddenJobs, setHiddenJobs] = useState([]);
  const handleHideJob = (jobId) => {
    setHiddenJobs(prevHiddenJobs => [...prevHiddenJobs, jobId]);
  };
  

  const fetchJobs = async (afterDoc = null) => {
    let jobQuery = query(
      collection(db, 'jobs'),
      orderBy('skills'), // or 'timestamp'
      limit(9)
    );

    if (afterDoc) {
      jobQuery = query(jobQuery, startAfter(afterDoc));
    }

    // Modify the query based on the selected search option and query
    if (searchQuery) {
      if (searchOption === 'title') {
        jobQuery = query(jobQuery, where('titleTokens', 'array-contains', searchQuery));
      } else if (searchOption === 'skills') {
        jobQuery = query(jobQuery, where('skillsTokens', 'array-contains', searchQuery));
      }
    }

    // Execute query and get snapshot of result
    const jobSnapshot = await getDocs(jobQuery);

    const newJobs = jobSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // if any result, set lastDoc to last document
    if (jobSnapshot.docs.length > 0) {
      setLastDoc(jobSnapshot.docs[jobSnapshot.docs.length - 1]);
    }

    setJobs(prevJobs => [...prevJobs, ...newJobs]);
  };

  useEffect(() => {
    // Clear the existing jobs list and lastDoc when searchOption or searchQuery changes
    setJobs([]);
    setLastDoc(null);

    // Then fetch the new set of jobs
    fetchJobs();
  }, [searchOption, searchQuery]);

  const loadMoreJobs = () => {
    if (lastDoc) {
      fetchJobs(lastDoc);
    }
  };

  return (
    <div className="Jobs">
      <h1>Job List</h1>
      <div style={{ marginBottom: '20px', marginInline: '5%' }}>
      <Icon name="filter" size="large" />
      <Filter
          value={searchOption}
          onChange={setSearchOption}
        />
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>
      <div className="job-list">
        {jobs.filter(job => !hiddenJobs.includes(job.id)).map((job) => (
          <JobCard
            key={job.id}
            id={job.id}
            url={job.imageUrl}
            position={job.position}
            description={job.description}
            skill={job.skills}
            projectLength={job.projectLength}
            paymentMin={job.paymentMin}
            paymentMax={job.paymentMax}
            workingHours={job.workingHours}
            experience={job.experience}
            period={job.period}
            onHide={() => handleHideJob(job.id)}
            isExpanded={job.id === expandedCardId}
            onExpand={() => setExpandedCardId(job.id)}
            onCollapse={() => setExpandedCardId(null)}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center",  paddingBlock: "50px" }}>
        <Button primary animated="vertical" onClick={loadMoreJobs}>
          <Button.Content visible>See More</Button.Content>
          <Button.Content hidden>
            <Icon name="arrow down" />
          </Button.Content>
        </Button>
      </div>
    </div>
  );
}

export default JobList;
