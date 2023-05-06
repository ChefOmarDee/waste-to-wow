import { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Model } from 'mongoose';

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
  // const { userID } = req.body as projectParams;

  try {
    console.log(req.body.userID)
    const newProject =await _projectModel.find({userID:req.body.userID.replace("|","")})
    res.status(200).send(newProject)
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating product' });
  }
}
  else{
    res.status(400).json({message:"no route"});
  }
}
