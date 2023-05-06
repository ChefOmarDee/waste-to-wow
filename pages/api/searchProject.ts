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
    userID:String
  },
  { collection: 'Projects' }
);

const modelName = 'Projects';

let _projectModel: Model<projectParams>;

if (mongoose.models[modelName]) {
  _projectModel = mongoose.model(modelName);
} else {
  _projectModel = mongoose.model<projectParams>(modelName, projectSchema);
}
async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
  try {
    const newProject =await _projectModel.find({projectMaterials: { $all: req.body.selectedMaterials}})
    res.status(200).send(newProject)
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