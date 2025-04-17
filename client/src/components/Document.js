import React from "react";
import "./Document.css"; // Scoped CSS file

const teamMembers = [
  {
    name: "Achintya Gupta",
    occupation: "3rd Year CSE Student in SRM University",
    contribution: "Team Leader and Full Stack Developer",
    email: "achintyagupta1@gmail.com",
    phone: "+91 9452438229",
    github: "https://github.com/AchintyaGupta2763",
    photo: "achintya.png"
  },
  {
    name: "Lavish Jhajhria",
    occupation: "3rd Year CSE Student in SRM University",
    contribution: "Backend Developer and Database manager",
    email: "lavishjhajhria47@gmail.com",
    phone: "+91 9460778164",
    github: "https://github.com/Lavish-Jhajhria",
    photo: "lavish.jpg"
  },
  {
    name: "Pratik",
    occupation: "3rd Year CSE Student in SRM University",
    contribution: "Backend Developer and Api Designer",
    email: "pratikjhajharia2152@gmail.com",
    phone: "+91 7597252357",
    github: "https://github.com/pratik5566",
    photo: "pratik.jpg"
  },
  {
    name: "Karan Raj Sharma",
    occupation: "3rd Year CSE Student in SRM University",
    contribution: "Frontend Developer and Authentication manager",
    email: "karanrajsharmakrs05@gmail.com",
    phone: "+91 7073256678",
    github: "https://github.com/KaranRajSharma",
    photo: "karan.jpg"
  },
  {
    name: "Dhruv Sharma",
    occupation: "3rd Year CSE Student in SRM University",
    contribution: "Frontend Developer and UI/UX designer",
    email: "itsmedhruv06@gmail.com",
    phone: "+91 9753041066",
    github: "http://github.com/dhruvsharma06",
    photo: "dhruv.jpg"
  }
  // Add other 4 members similarly...
];

const Documentation = () => {
    return (
      <div className="documentation-page">
        <h1>OUR TEAM</h1>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-card" key={index}>
              <div className="team-photo-container">
                <img src={member.photo} alt={member.name} className="team-photo" />
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <p><strong>Occupation:</strong> {member.occupation}</p>
                <p><strong>Contribution:</strong> {member.contribution}</p>
                <p><strong>Email:</strong> <a href={`mailto:${member.email}`}>{member.email}</a></p>
                <p><strong>Phone:</strong> <a href={`tel:${member.phone}`}>{member.phone}</a></p>
                <p><strong>GitHub:</strong> <a href={member.github} target="_blank" rel="noopener noreferrer">
                  {member.github.replace(/^https?:\/\//, '')}
                </a></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default Documentation;
