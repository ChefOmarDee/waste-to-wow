import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from 'axios'
import AWS from "aws-sdk";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";


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

type MaterialType = 'Paper' | 'Cardboard' | 'Plastics' | 'Glass' | 'Aluminum cans' | 'LDPE (low-density polyethylene) bags and films' | 'PP (polypropylene) containers and packaging' | 'Polystyrene (styrofoam)' | 'Newspapers and magazines' | 'Corrugated cardboard' | 'Beverage cartons (milk, juice, etc.)' | 'Scrap metal' | 'Textiles (clothing, bedding, etc.)' | 'Tires';

const materialOptions = [
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


const EditProject = () => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const data = router.query as unknown as QueryData;
  const [expanded, setExpanded] = useState(false);
  const [mainImageS, setMainImageS] = useState<string>("");
  const [name, setName] = useState<string>(data.projectName);
  const [projectMaterials, setProjectMaterials] = useState<string[]>(data.projectMaterials);
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialType[]>([]);
  const [projectSteps, setProjectSteps] = useState<string>(data.projectSteps);
  const [images, setImages] = useState<File[]>([]);
  const [imageNames, setImageNames] = useState<string[]>(data.projectImages|| []); // New stateful array to hold the names of all uploaded files
  const [mainImage, setMainImage]=useState<File>();
  const [mainImageName,setMainImageName]=useState<string>(data.projectMainImage||'');



  const handleImageClick = (image: string) => {
    setMainImageS(image);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files){
    setImages([...Array.from(files)]);
    const names = Array.from(files).map(file => user?.sub+file.name);
    console.log(names)
    setImageNames([...imageNames, ...names]);
    }
  };
  function handleClick() {
    setExpanded(!expanded);
  }
  const checkBoxHandler = (event: React.ChangeEvent<HTMLInputElement>, material: string) => {
    const materialType = material as MaterialType;
    if (projectMaterials.includes(materialType)) {
      setProjectMaterials(projectMaterials.filter((mat) => mat !== materialType))
    } else {
      setProjectMaterials([...projectMaterials, materialType]);
    }
  };

  const postHandler=async()=>{
      console.log(projectMaterials)
    let _data={
      oldProjectName:data.projectName,
      name,
      projectMaterials,
      projectSteps,
      imageNames,
      mainImageName
    }
    console.log(data)
    console.log(imageNames)
    console.log(_data)

    await axios.post('/api/updateProject', _data)
  }

  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files?.length){
      let file = event.target.files[0];
      if (file){
        setMainImage(file)
        setMainImageName(user?.sub+file.name)
        setImages([...images, (file)]);
        setImageNames([...imageNames, user?.sub+file.name]);
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
      console.log(images)
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
        console.log(params)
        // Upload the file to S3
        await s3.upload(params).promise();
    }
    await postHandler()
    router.push('/ViewPersonal')

  };
  const imageDeleteHandler= async(image:String)=>{
    console.log(image)
    const filteredImageNames = imageNames.filter((imageName) => imageName !== image);
    if(!filteredImageNames.includes(data.projectMainImage)){
      alert("cannot delete main image, try ressigning it first")
    }
    else if(filteredImageNames.length===1){
      alert("Must have at least two images")
    }
    else{
      setImageNames(filteredImageNames);
      console.log(filteredImageNames)
      const payload={
        projectName:data.projectName,
        projectMainImage:image,
        projectImages:filteredImageNames,
        deleteImageToken:1
      }
      const response = await axios.post('/api/deleteproject', {
        data: payload
      });
    }
  }

  const deleteHandler = async () => {
    const payload = {
      projectName: data.projectName,
      projectImages: data.projectImages,
      projectMainImage: data.projectMainImage
    };
  
      console.log(payload);
  
      const response = await axios.post('/api/deleteproject', {
        data: payload
      });
      router.push('/ViewPersonal')
  }
  useEffect(() => {
    if (data.projectMainImage) {
      setMainImageS(data.projectMainImage);
    }
  }, [data.projectMainImage]);
  return (
    <div className="text-white">
    <div className="flex flex-col md:flex-row justify-center itesms-center py-12 text-white">
      <div className="md:w-1/2 p-4">
        <img
          src={`https://chefomardee-testing3.s3.us-east-1.amazonaws.com/${mainImageS}`}
          className="w-full md:max-w-md md:mx-auto cursor-pointer"
          style={{ width: "100%" }}
        />
        <div className="flex flex-wrap justify-center mt-4">
          {Array.isArray(imageNames) && 
            imageNames.map((image, index) => (
              <div key={index} className="relative">
      <img
        src={`https://chefomardee-testing3.s3.us-east-1.amazonaws.com/${image}`}
        className="w-32 h-32 object-cover m-2 cursor-pointer"
        onClick={() => setMainImageS(image)}
      />
      <button
        className="absolute top-2 right-2"
        onClick={()=>imageDeleteHandler(image)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
            ))}
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <div className="md:w-1/2 p-4 flex flex-col justify-center items-center md:items-mid item-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center space-y-4 h-screen text-black">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Project Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder:text-black-400"
        />
        <textarea
          value={projectSteps}
          onChange={(event) => setProjectSteps(event.target.value)}
          placeholder="Project Steps"
          className="w-full px-12 py-12 border border-black-300 rounded-md"
          style={{ height: "200px" }}
        />
         <div className="mb-4 text-white">
          <label htmlFor="materials" className="text-center block font-medium mb-2">
            Materials:
          </label>
          {materialOptions.map((material) => (
            <div key={material} className="flex items-center mb-2">
              <input
                id={material}
                type="checkbox"
                value={material}
                checked={projectMaterials.includes(material)}
                onChange={(e)=>checkBoxHandler(e,material)}
                className="mr-2"
              />
              <label htmlFor={material} className="select-none">
                {material}
              </label>
            </div>
          ))}
  </div>
        <div className="relative w-full">
          <input type="file" multiple onChange={handleImageUpload} className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer" />
          <div className="relative z-40 w-full h-full px-3 py-2 border border-gray-300 rounded-md bg-white">
            <span className="text-black">Select Extra Images</span>
            <span className="ml-2 text-black" id="file-chosen"></span>
          </div>
        </div>
        <div className="relative w-full">
          <input type="file" onChange={handleMainImageUpload} className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer" />
          <div className="relative z-40 w-full h-full px-3 py-2 border border-gray-300 rounded-md bg-white">
            <span className="text-black">Select Main Image</span>
            <span className="ml-2 text-black" id="file-chosen"></span>
          </div>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
          Confirm Project Changes
        </button>
      </form>
      <br/>
      <br/>
      <br/>
      <br/>
        <button onClick={deleteHandler} className="bg-blue-500 text-white py-2 px-4 rounded">
          Remove Project
        </button>
      </div>
    </div>
    </div>
  );
};

export default EditProject;
export const getServerSideProps = withPageAuthRequired()

