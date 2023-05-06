import React, { useState } from 'react'
import { useRouter } from "next/router";
import axios from 'axios'
import AWS from "aws-sdk";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";

type MaterialType = 'Paper' | 'Cardboard' | 'Plastics' | 'Glass' | 'Aluminum cans' | 'LDPE (low-density polyethylene) bags and films' | 'PP (polypropylene) containers and packaging' | 'Polystyrene (styrofoam)' | 'Newspapers and magazines' | 'Corrugated cardboard' | 'Beverage cartons (milk, juice, etc.)' | 'Scrap metal' | 'Textiles (clothing, bedding, etc.)' | 'Tires';

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


const Add=()=>{
    const { user, error, isLoading } = useUser();
    const [projectName, setProjectName] = useState('');
    const [selectedMaterials, setSelectedMaterials] = useState<MaterialType[]>([]);
    const [projectSteps, setProjectSteps] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [imageNames, setImageNames] = useState<string[]>([]); // New stateful array to hold the names of all uploaded files
    const [mainImage, setMainImage]=useState<File>();
    const [mainImageName,setMainImageName]=useState<string>("");
    
    const router = useRouter();
    // user.sub
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files){
        setImages([...images, ...Array.from(files)]);
        const names = Array.from(files).map(file => user?.sub+file.name);
        setImageNames([...imageNames, ...names]);
        }
      };
      let postHandler=async()=>{
        if(user?.sub){
          let data={
            projectName,
            selectedMaterials,
            projectSteps,
            imageNames,
            mainImageName,
            userID:(user?.sub).replace("|",""),
            userName:user?.name
          }
          await axios.post('/api/addProject', data)
        }
      }
    
      const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files?.length){
          let file = event.target.files[0];
          if (file){
            setMainImage(file)
            setMainImageName(user?.sub+file.name)
            setImages([...images, (file)]);
            setImageNames([...imageNames, (user?.sub+file.name)]);
          }
        }
      };
    
      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const s3 = new AWS.S3({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
    });
    if(images?.length){
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        // Create an S3 bucket object key using the current timestamp and the original file name
        const key = user?.sub+file.name;
        // Set the S3 upload parameters
        const params = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
          Key: key,
          Body: file,
          ContentType: file.type,
        };
  
        // Upload the file to S3
        await s3.upload(params).promise();
      }
    }
    if (mainImage){
      const file = mainImage;
      const key = `${user?.sub+file.name}`;
        // Set the S3 upload parameters
        const params = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
          Key: key,
          Body: file,
          ContentType: file.type,
        };
        // Upload the file to S3
        await s3.upload(params).promise();
    }
    await postHandler()
  };


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
    <label htmlFor="project-name" className="text-center block font-medium mb-2">
      Project Name:
    </label>
    <input
      id="project-name"
      type="text"
      value={projectName}
      onChange={(e) => setProjectName(e.target.value)}
      className="text-center border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 rounded-md shadow-sm"
    />
  </div>
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
  </div>
  <center>
  <div className="mb-4">
    <label htmlFor="project-steps" className="text-center block font-medium mb-2">
      Project Steps:
    </label>
    <textarea
      id="project-steps"
      value={projectSteps}
      onChange={(e) => setProjectSteps(e.target.value)}
      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-8 rounded-md shadow-sm"
    />
  </div>
  <div className="relative w-1/2">
    <input type="file" multiple onChange={handleImageUpload} className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer" />
    <div className="relative z-40 w-full h-full px-3 py-2 border border-gray-300 rounded-md bg-white">
      <span className="text-black">Select Extra Images</span>
      <span className="ml-2 text-black" id="file-chosen"></span>
    </div>
  </div>
  <br/>
  <div className="relative w-1/2">
    <input type="file" onChange={handleMainImageUpload} className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer" />
    <div className="relative z-40 w-full h-full px-3 py-2 border border-gray-300 rounded-md bg-white">
      <span className="text-black">Select Main Image</span>
      <span className="ml-2 text-black" id="file-chosen"></span>
    </div>
  </div>
  </center>
  <br/>
  <div className="flex justify-center">
    <button type="submit" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
      Submit
    </button>
  </div>
</form>

    </React.Fragment>
);
}
export default Add;
export const getServerSideProps = withPageAuthRequired()


