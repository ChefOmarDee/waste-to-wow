import { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Model } from 'mongoose';
import AWS from 'aws-sdk';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

const S3 = new AWS.S3();
type projectParams = {
    projectName: string;
    projectMaterials: string[];
    projectSteps: string;
    projectImages: string[];
    projectMainImage: string;
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
  
  let _ProjectModel: Model<projectParams>;
  
  if (mongoose.models[modelName]) {
    _ProjectModel = mongoose.model(modelName);
  } else {
    _ProjectModel = mongoose.model<projectParams>(modelName, projectSchema);
  }

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    

    try {
      const data= req.body;
      console.log(data)
      const doc = await _ProjectModel.findOne({ projectName: data.oldProjectName });
      if (doc) {
        console.log(doc)
        doc.projectName = data.name;
        doc.projectSteps = data.projectSteps;
        doc.projectMaterials = data.projectMaterials;
        doc.projectImages = data.imageNames;
        doc.projectMainImage = data.mainImageName;
        await doc.save();
    }
      res.status(200).send('Success');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting images from S3' });
    }
  } else {
    res.status(404).json({ message: 'API route not found' });
  }
}
export default withApiAuthRequired(handler)
