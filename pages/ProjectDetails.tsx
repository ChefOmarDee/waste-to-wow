import React,{useState,useEffect} from "react"
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

interface QueryData {
    projectID: string;
    projectImages: string[];
    projectMainImage: string;
    projectName: string;
    projectMaterials: string[];
    projectSteps: string;
    userID:string;
    userName:string;
  }

const ProjectDetail=()=>{
    const router = useRouter();
    const data = router.query as unknown as QueryData;

    const [projectName, setProjectName] = useState<string>(data.projectName);
    const [projectSteps, setprojectSteps] = useState<string>(data.projectSteps);
    const [projectMaterials, setProjectMaterials] = useState<string[]>(data.projectMaterials||[]);
    const [projectID, setProjectID] = useState<string>(data.projectID);
    const [projectImages, setProjectImages] = useState<string[]>(data.projectImages|| []); // New stateful array to hold the names of all uploaded files
    const [projectMainImage, setprojectMainImage]=useState<string>(data.projectMainImage||'');
    const [userID,setUserID]=useState<string>(data.userID);
    const [userName,setuserName]=useState<string>(data.userName);


    const handleImageClick = (image: string) => {
        setprojectMainImage(image);
    };
    const handleSubmit=(e:any)=>{
        e.preventDefault()
    }

    useEffect(() => {
        if (data.projectMainImage) {
          setprojectMainImage(data.projectMainImage);
        }
      }, [data.projectMainImage]);

    return(
    <div className="flex flex-col md:flex-row justify-center text-white itesms-center py-12">
      <div className="md:w-1/2 p-4">
        <img
          src={`https://chefomardee-testing3.s3.amazonaws.com/${projectMainImage}`}
          className="w-full md:max-w-md md:mx-auto cursor-pointer"
          style={{ width: "100%" }}
        />
        <div className="flex flex-wrap justify-center mt-4">
          {Array.isArray(projectImages) && // type guard to check if data.projectImage is an array
            projectImages.map((image, index) => (
              <div key={index} className="relative">
      <img
        src={`https://chefomardee-testing3.s3.amazonaws.com/${image}`}
        className="w-32 h-32 object-cover m-2 cursor-pointer"
        onClick={() => setprojectMainImage(image)}
      />
    </div>
            ))}
        </div>
      </div>
      <div className="md:w-1/2 p-4 flex flex-col justify-center items-center md:items-mid item-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center space-y-4 h-screen text-black">
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-white">
            {projectName}
        </div>
        <textarea
          value={projectSteps}
          placeholder="Project Description"
          className="w-full px-3 py-12 border border-black-300 text-white rounded-md"
        />
          <div
          className="w-full px-3 py-2 border border-black-300 rounded-md"
        >
        <ul className="list-disc list-inside mb-4">
        {data.projectMaterials.map((material, index) => (
          <li key={index} className="text-white">{material}</li>
            ))}
        </ul>
        </div>
      </form>
      </div>
    </div>
  );
}
export default ProjectDetail
export const getServerSideProps = withPageAuthRequired()
