import { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Model } from 'mongoose';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

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

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
  const { projectName, selectedMaterials, projectSteps, imageNames, mainImageName, userID,userName } = req.body as projectParams;

  try {
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
    res.status(200).json({ message: 'Project created successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating project' });
  }
}
  else{
    res.status(400).json({message:"no route"});
  }
}
export default withApiAuthRequired(handler)