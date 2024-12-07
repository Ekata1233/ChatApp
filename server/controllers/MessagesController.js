import { ImOffice } from "react-icons/im";
import Message from "../models/messagesModel.js"
import {mkdirSync, renameSync} from 'fs'
export const getMessages =async (request , response, next )=>{
    try{
       
        const user1=request.userId;
        const user2=request.body.id;


        if(!user1  || !user2){
            return response.status(400).send("Both user ID's required.")
        }

       

         const messages =await Message.find({
            $or:[
                {sender:user1,recipient:user2},
                {sender:user2,recipient:user1},
            ],
         }).sort({timestamp:1});

       return response.status(200).json({messages});

   

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server error")
    }

}

export const uploadFile =async (request , response, next )=>{
    try{
       
       if(!request.file){
        return response.status(400).send("File is required.")
       }

       const date=Date.now();
       let fileDir=`uploads/files/${date}`
       let fileName = `${fileDir}/${request.file.originalname}`;
       mkdirSync(fileDir,{recursive:true});

       renameSync(request.file.path,fileName)
       
       return response.status(200).json({filePath:fileName});

   

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server error")
    }

}
export const deleteChatMessages = async (request, response, next) => {
    try {
      const user1 = request.userId; 
      const user2 = request.body.id; 
  
      if (!user1 || !user2) {
        return response.status(400).send("Both user IDs are required.");
      }
  
      const result = await Message.deleteMany({
        $or: [
          { sender: user1, recipient: user2 },
          { sender: user2, recipient: user1 },
        ],
      });
  
      if (result.deletedCount === 0) {
        return response.status(404).send("No messages found to delete.");
      }
  
      return response.status(200).json({ message: "Messages deleted successfully." });
    } catch (error) {
      console.error({ error });
      return response.status(500).send("Internal server error");
    }
  };