import React,{useState, useEffect} from "react"
import axios from 'axios';
import { withPageAuthRequired } from "@auth0/nextjs-auth0";


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
  
const AIProject=()=>{
    const [projects, setProjects] = useState<string>('');
    const [selectedMaterials, setSelectedMaterials] = useState<MaterialType[]>([]);

    const handleSubmit=(e:any)=>{
        e.preventDefault()
        console.log(selectedMaterials)

        const postHandler=async ()=>{
            const data= {
              materialList: await selectedMaterials.join(',')
            }
            let res= await axios.post('/api/hello', data)
            setProjects(res.data)
            console.log(res.data)
        }
        postHandler()
      }

      const handleMaterialChange = (material: MaterialType) => {
        if (selectedMaterials.includes(material)) {
          setSelectedMaterials(selectedMaterials.filter((selected) => selected !== material));
        } else {
          setSelectedMaterials([...selectedMaterials, material]);
        }
      };
      
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
          <center><button type="submit">Submit</button></center>
    </div>
    </form>
    <center><p className="w-1/2">{projects}</p></center>
        </React.Fragment>

    )
}
export default AIProject;
export const getServerSideProps = withPageAuthRequired()
