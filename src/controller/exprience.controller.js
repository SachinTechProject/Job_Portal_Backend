import { Experience } from "../models/experience.model.js"


const addExperience = async (req, res)=>{

    try {
        
        const {jobTitle,company,location,startDate,endDate,description} = req.body
        
        const userId = req.user._id
        
        const experience = await Experience.create({
            jobTitle,company,location,startDate,endDate,description, userId: userId
        })

        if(!experience){
            return res.status(400).json({message: "Experience not created !!"})
        }
        
        return res.status(201).json({message:"Experience Added !!", experience})

    } catch (error) {
        console.log("Server error", error)
        res.status(500).json({message:" Server error", error})
    }
}


const getExperience = async (req, res)=>{

    try {
        const userId = req.user._id
        
            const experience = await Experience.find({ userId })
              
        
              if(!experience){
                return res.status(404).json({message:"Experience not found !!"})
              }

              return res.status(200).json({message:"Get Experience", experience})
             

    } catch (error) {
        console.log("Server error", error)
        res.status("Server error", error)
    }

}

  const updateExperience = async (req, res)=>{

    try {
        
        const {jobTitle,company,location,startDate,endDate,description} = req.body

        const {id} = req.params

        const updateExp = await Experience.findOneAndUpdate(
            {_id: id, userId: req.user._id},
            {
                $set:{jobTitle,company,location,startDate,endDate,description}
            },
            { new: true, unValidators: true }
        )
     
        if(!updateExp){
            return res.status(404).json({message:"Experience not found !!"})
        } 

       return res.status(200).json({message:"Experiences updated successfully !!", updateExp})

    } catch (error) {
        console.log("Server error", error)
        res.status(500).json({message:"Server error", error})
    }

  }



export { addExperience, updateExperience, getExperience }