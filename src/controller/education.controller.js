import { Education } from "../models/education.model.js"
import { Resume } from "../models/resume.model.js"



const addEducation = async (req, res)=>{

    try {

        const {degree, field, university, year, gap, } = req.body

        const userId = req.user._id

        const education = await Education.create({
            degree,
            field,
            university,
            year,
            gap,
            userId
        })

         await Resume.findOneAndUpdate(
      { userId },
      { $push: { education: education._id } },
      { upsert: true }
    )

       return res.status(201).json({message:"Education added", education})
        
    } catch (error) {
        console.log("Server error", error)
        res.status(500).json({message:"Server error", error})
    }


}


const getEducation = async (req, res)=>{

    try {
        const userId = req.user._id
        
            const education = await Education.find({ userId })
              
        
              if(!education){
                return res.status(404).json({message:"Education not found !!"})
              }

              return res.status(200).json({message:"Get Education", education})
             

    } catch (error) {
        console.log("Server error", error)
        res.status("Server error", error)
    }

}


const updateEducation = async (req, res)=>{
     
    try {
        const {degree, field, university, year, gap, } = req.body

        const {id} = req.params

        const education = await Education.findOneAndUpdate(
            {_id: id, userId: req.user._id },
            {
              $set:{degree, field, university, year, gap}
            },
            { new: true, runValidators: true }
        )
        if(!education){
           if(!education){
            return res.status(404).json({message:"Education not found"})
}
        }

      return res.status(201).json({message:"Education is updated !!", education})


    } catch (error) {
        console.log("Server error", error)
        res.status(500).json({message:"Server error", error})
    }
}

export { addEducation, updateEducation, getEducation }