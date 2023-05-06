import { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Model } from 'mongoose';
import AWS from 'aws-sdk';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
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
  
  let ProjectModel: Model<projectParams>;
  
  if (mongoose.models[modelName]) {
    ProjectModel = mongoose.model(modelName);
  } else {
    ProjectModel = mongoose.model<projectParams>(modelName, projectSchema);
  }

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { projectName, projectImages, projectMainImage, deleteImageToken} = req.body.data;
    
    if (deleteImageToken) {
      console.log("stuff happened");

      await S3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: projectMainImage,
      }).promise();

      const doc = await ProjectModel.findOne({ projectName: projectName });

      if (doc) {
        console.log(doc)
        if(!projectImages.includes(doc.projectMainImage)){
          doc.projectMainImage = '';
        }
        doc.projectImages = projectImages;
        await doc.save();
        console.log("Doc updated successfully");
      }else{
        console.log("no doc")
      }

      res.status(200).send("successfully deleted Image");
    } else {
      await ProjectModel.deleteOne({ projectName: projectName });
      
      try {
        for (let i = 0; i < projectImages.length; i++) {
          let key = projectImages[i];
          await S3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
          }).promise();
        }
        res.status(200).send("good stuff");
      }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Delete went wrong' });
      }
    }
  } else {
    res.status(404).json({ message: 'API route not found' });
  }
}
export default withApiAuthRequired(handler)

