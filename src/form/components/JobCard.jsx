import React, { useState, useEffect, useRef } from "react";
import "./JobCard.css";

const JobCard = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef();

  console.log(`Card ${props.id} isExpanded:`, props.isExpanded);


  const handleCardClick = (e) => {
    e.stopPropagation();
    if (!props.isExpanded) {
      props.onExpand();
    }
  };
  

  const handleClickOutside = (e) => {
    if (cardRef.current && !cardRef.current.contains(e.target)) {
      props.onCollapse();
    }
  };

  const handleHideClick = (e) => {
    e.stopPropagation(); // Prevent this click from being propagated to handleCardClick
    props.onHide();
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={`Card ${props.isExpanded ? "expanded" : ""}`} onClick={handleCardClick} ref={cardRef}>
      <div className="content">
        <img src={props.url} alt="Image" />
        <div className="header">{props.position}</div>
        <div className="description">{props.description}</div>
        <div className="skill">{"Skill: " + props.skill}</div>
      </div>

      {props.isExpanded && (
        <>
          <div className="extra-content">
            <p>{"Project Length: " + props.projectLength}</p>
            <p>{"Minimum Payment: " + props.paymentMin}</p>
            <p>{"Maximum Payment: " + props.paymentMax}</p>
            <p>{"Working hours: " + props.workingHours}</p>
            {props.experience && <p>{"Experience: " + props.experience}</p>}
            {props.period && <p>{"Period: " + props.period}</p>}
            <button onClick={handleHideClick}>Delete</button>

          </div>
          <div className="overlay"></div>
        </>
      )}
    </div>
  );
};

export default JobCard;
