import { Link } from "react-router-dom";
import "./projectList.css";

const ProjectList = ({ projects }) => {
  return (
    <div className="project-list">
      {projects.map((project) => (
        <div key={project.id} className="project-card">
          <hr className="card-top-border" />
          <div className="project-content">
            <div className="project-info">
              <Link to={`${project.link}`} className="project-title">
                {project.title}
              </Link>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-github"
              >
                GitHub Repo
              </a>
            </div>

            <Link to={`${project.link}`}>
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
              />
            </Link>

            <div className="project-description">{project.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;