import { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Model } from 'mongoose';

type projectParams = {
  projectName: string;
  selectedMaterials: string[];
  projectSteps: string;
  imageNames: string[];
  mainImageName: string;
  userID:string;
  userName:string;
};

if (process.env.NEXT_PUBLIC_MONGO_URI) {
  mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI);
}

const projectSchema = new mongoose.Schema(
  {
    projectName: String,
    projectSteps: String,
    projectMaterials: [String],
    projectImages: [String],
    projectMainImage: String,
    userID:String,
    userName:String
  },
  { collection: 'Projects' }
);

const modelName = 'Projects';

let projectModel: Model<projectParams>;

if (mongoose.models[modelName]) {
  projectModel = mongoose.model(modelName);
} else {
  projectModel = mongoose.model<projectParams>(modelName, projectSchema);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
  const { projectName, selectedMaterials, projectSteps, imageNames, mainImageName, userID,userName } = req.body as projectParams;

  console.log('Project Name:', projectName);
  console.log('Selected Materials:', selectedMaterials);
  console.log('Project Steps:', projectSteps);
  console.log('Image Names:', imageNames);
  console.log('Main Image Name:', mainImageName);
  console.log('UserID:', userID);
  console.log('UserName:', userName);



  try {
    console.log(req.body)
    const newProject = new projectModel({
      projectName:projectName,
      projectSteps:projectSteps,
      projectMaterials: selectedMaterials,
      projectImages: imageNames,
      projectMainImage:mainImageName,
      userID:userID,
      userName:userName
    });

    const options = { wtimeout: 25000 };
    await newProject.save(options);
    res.status(200).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating product' });
  }
}
  else{
    res.status(400).json({message:"no route"});
  }
}