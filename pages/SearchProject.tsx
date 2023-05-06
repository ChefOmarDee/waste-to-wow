import React, {useEffect, useState} from "react"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import axios from 'axios';

type MaterialType = 'Paper' | 'Cardboard' | 'Plastics' | 'Glass' | 'Aluminum cans' | 'LDPE (low-density polyethylene) bags and films' | 'PP (polypropylene) containers and packaging' | 'Polystyrene (styrofoam)' | 'Newspapers and magazines' | 'Corrugated cardboard' | 'Beverage cartons (milk, juice, etc.)' | 'Scrap metal' | 'Textiles (clothing, bedding, etc.)' | 'Tires';

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
  const materialOptions: MaterialType[] = [
    'Paper',
    'Cardboard',
    'Plastics',
    'Glass',
    'Aluminum cans',
    'LDPE (low-density polyethylene) bags and films',
    'PP (polypropylene) containers and packaging',
    'Polystyrene (styrofoam)',
    'Newspapers and magazines',
    'Corrugated cardboard',
    'Beverage cartons (milk, juice, etc.)',
    'Textiles (clothing, bedding, etc.)',
    'Tires'
  ];

const SearchProject=()=>{
    const [projects, setProjects] = useState<Project[]>([]);
    const { user, error, isLoading } = useUser();
    const [selectedMaterials, setSelectedMaterials] = useState<MaterialType[]>([]);

    const handleMaterialChange = (material: MaterialType) => {
        if (selectedMaterials.includes(material)) {
          setSelectedMaterials(selectedMaterials.filter((selected) => selected !== material));
        } else {
          setSelectedMaterials([...selectedMaterials, material]);
        }
      };
      
      const handleSubmit=(e:any)=>{
        e.preventDefault()
        console.log(selectedMaterials)
        const postHandler=async ()=>{
            const data= await {
                selectedMaterials
            }
            let res= await axios.post('/api/searchProject', data)
            setProjects(res.data)
        }
        postHandler()
      }

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await axios.post('/api/getAllProjects');
      console.log(res.data)
      setProjects(res.data);
    }
    console.log(user?.sub)
    fetchProjects();
  }, []);

    return(
    <React.Fragment>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
    <div className="mb-4">
          <label htmlFor="materials" className="text-center block font-medium mb-2">
            Materials:
          </label>
          {materialOptions.map((material) => (
            <div key={material} className="flex items-center mb-2">
              <input
                id={material}
                type="checkbox"
                value={material}
                checked={selectedMaterials.includes(material)}
                onChange={() => handleMaterialChange(material)}
                className="mr-2"
              />
              <label htmlFor={material} className="select-none">
                {material}
              </label>
            </div>
          ))}
          <button type="submit">Submit</button>
    </div>
    </form>
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
    )
}
export default SearchProject
export const getServerSideProps = withPageAuthRequired()
