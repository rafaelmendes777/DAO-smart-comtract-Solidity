const { section, projects } = props;

const ProjectsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
`;

const ProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;

  .wrapper {
    background: white;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0px 20px 40px 0px rgba(61, 72, 102, 0.4);
    padding: 5px;

    .image {
      border-radius: 20px;
      width: 240px;
      height: 240px;
    }
  }

  .title {
    color: #222325;
    font-size: 20px;
    font-weight: 400;
  }
`;

const ProjectCard = ({ project }) => (
  <ProjectContainer>
    <div className="wrapper">
      <img className="image" src={project.logo_url} />
    </div>
    <span className="title">{project.title}</span>
  </ProjectContainer>
);

return (
  <>
    <h3 style={{ marginBottom: "2rem" }}>{section.projects.title}</h3>
    <div className="d-flex flex-wrap justify-content-center gap-5">
      {projects
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((project) => (
          <ProjectCard project={project} />
        ))}
    </div>
  </>
);
