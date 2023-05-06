import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios'
import Link from 'next/link'
import { useUser } from "@auth0/nextjs-auth0/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
interface Project {
    _id: string;
    projectName: string;
    projectSteps: string;
    projectMaterials: string[];
    projectImages: string[];
    projectMainImage: string;
    userID:string,
    userName:string
  }

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const { user, error, isLoading } = useUser();

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await axios.post('/api/getAllProjects');
      console.log(res.data)
      setProjects(res.data);
    }
    console.log(user?.sub)
    fetchProjects();
  }, []);

  return (
    <React.Fragment>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {projects.map((project, index) => (
      <Link
        key={project._id} // add unique key prop
        href={{
          pathname: '/ProjectDetails',
          query: {
            projectID: project._id,
            projectName:project.projectName,
            projectMainImage:project.projectMainImage,
            projectImages:project.projectImages,
            projectMaterials:project.projectMaterials,
            projectSteps:project.projectSteps,
            userID: project.userID,
            userName:project.userName
          } 
        }}>
        <div className="p-4 border border-gray-300 shadow-lg rounded-lg">
          <div className="flex-grow">
            <center>
              {project.projectImages[0] && 
                <img
                  className="object-cover rounded-lg"
                  style={{ width: '400px', height: '200px' }}
                  src={"https://chefomardee-testing3.s3.amazonaws.com/" + project.projectMainImage}
                  alt={project.projectName}
                />
              }
            </center>
          </div>
          <div className="mt-2">
            <center>
              <h2 className="text-lg font-bold mb-2 ">{project.projectName}</h2>
            </center>
          </div>
        </div>
      </Link>
    ))}
    </div>
  </React.Fragment>
  );
  
};

export default Projects;
export const getServerSideProps = withPageAuthRequired()

