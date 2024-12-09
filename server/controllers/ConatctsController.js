import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/messagesModel.js";

export const searchContacts =async (request , response, next )=>{
    try{
       
        const {searchTerm}=request.body;
        if(searchTerm === undefined || searchTerm ===null){
            return response.status(400).send("SearchTerm is required.")
        }

        const sanitizedSearchTerm =searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,"\\$&"
        );
         const regex=new RegExp(sanitizedSearchTerm,"i");

         const contacts =await User.find({
           $and: [ {_id: {$ne:request.userId}},
            {
                $or : [{firstName:regex},{lastName:regex},{email:regex}],
           },],
         });

         return response.status(200).json({contacts});

       
         return response.status(200).send("Logout successfull");
   

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server error")
    }

}

export const getContactsForDMList =async (request , response, next )=>{
    try{
       
       let {userId}=request;

       userId= new mongoose.Types.ObjectId(userId);

       const contacts=await Message.aggregate([
        {
            $match:{
                $or:[{sender:userId},{recipient:userId}]
            },
        },
        {
            $sort:{timestamo:-1},
        },
        {
            $group:{
                _id:{
                    $cond:{
                        if:{$eq:["$sender",userId]},
                        then:"$recipient",
                        else:"$sender",
                    },
                },
                lastMessageTime:{$first:"$timestamp"},
            },
        },
        {
            $lookup:{
                from:"users",
                localField:"_id",
                foreignField:"_id",
                as:"contactInfo",
            }
        },
        {
            $unwind:"$contactInfo",
        },
        {
            $project:{
                _id:1,
                lastMessageTime:1,
                email:"$contactInfo.email",
                firstName:"$contactInfo.firstName",
                lastName:"$contactInfo.lastName",
                image:"$contactInfo.iamge",
                color:"$contactInfo.color",


             }
        },
        {
            $sort:{lastMessageTime:-1},
        }
       ])

         return response.status(200).json({contacts});

       

   

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server error")
    }

}

export const getAllContacts =async (request , response, next )=>{
    try{
       
        
        const users=await User.find({_id:{$ne : request.userId}},"firstName lastName _id");

        const contacts = users.map((user)=>({
            label:user.firstName ? ` ${user.firstName} ${user.lastName}`: user.email,
            value:user._id,
        }))
        

         return response.status(200).json({contacts});

       
   

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server error")
    }

}

export const getUserDetails = async (request, response, next) => {
    try {
      const { userId } = request.params; // Assuming `userId` is passed as a route parameter
  
      // Find the user by ID
      const user = await User.findById(userId, "firstName lastName email _id iamge");
  
      if (!user) {
        return response.status(404).json({ message: "User not found" });
      }
  
      // Construct the response object
      const userDetails = {
        username: user.firstName ? `${user.firstName} ${user.lastName}` : "Unknown User",
        email: user.email,
        id: user._id,
        image:user.iamge,
      };
  
      return response.status(200).json({ userDetails });
    } catch (error) {
      console.error("Error fetching user details:", error);
      return response.status(500).send("Internal server error");
    }
  };