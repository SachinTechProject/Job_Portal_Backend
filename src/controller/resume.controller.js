import { Resume } from "../models/resume.model.js"



const createResume = async (req, res)=>{
    const{
      phoneNumber,
      dateOfBirth,
      linkedinUrl,
      currentLocation,
      githubUrl,
      projects,
      skills,
      certifications,
      preferredJobType,
      preferredLocation,
      expectedSalary,
      availability,
      resumeUrl,
      portfolioUrl,
      professionalSummary,
      education
    } = req.body


    try {
        const userId = req.user._id
        let skillsArray
        if(skills){
           skillsArray = typeof skills === 'string' ? skills.split(",").map(skill => skill.trim()) : skills
        }
    
        const newResume = await Resume.create({
          phoneNumber,
          userId:userId,
          dateOfBirth,
          linkedinUrl,
          currentLocation,
          githubUrl,
          projects,
          skills: skillsArray,
          certifications,
          preferredJobType,
          preferredLocation,
          expectedSalary,
          availability,
          resumeUrl,
          portfolioUrl,
          professionalSummary,
          education
        })
        res.status(201).json({message:"Resume updated", newResume})
    } catch (error) {
        console.log("Server error", error)
        res.status(500).json({message:"Server error", error})
    }


}

const getResume = async (req, res) => {
  try {
    const userId = req.user._id

    const resume = await Resume.findOne({ userId })
      .populate("education")

      if(!resume){
      return res.status(404).json({
        message:"Resume not Created, pleace create the resume"
      })
    }
    res.status(200).json({message:"All resume details", resume})

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const updateResume = async (req,res)=>{
     const{
      phoneNumber,
      dateOfBirth,
      linkedinUrl,
      currentLocation,
      githubUrl,
      projects,
      skills,
      certifications,
      preferredJobType,
      preferredLocation,
      expectedSalary,
      availability,
      resumeUrl,
      portfolioUrl,
      professionalSummary,
      education
    } = req.body

  try {
      const {id} = req.params
  
       let skillsArray
    if(skills){
      skillsArray = typeof skills === 'string' ? skills.split(",").map(skill => skill.trim()) : skills
    }

      const update = await Resume.findOneAndUpdate(
          {_id: id, userId:req.user._id},
          {
               phoneNumber,
        dateOfBirth,
        linkedinUrl,
        currentLocation,
        githubUrl,
        projects,
        skills: skillsArray,
        certifications,
        preferredJobType,
        preferredLocation,
        expectedSalary,
        availability,
        resumeUrl,
        portfolioUrl,
        professionalSummary,
        education
          },
          { new: true }
      ).populate("education")
  if(!update){
      return res.status(404).json({
        message:"Resume not found"
      })
    }
      return res.status(200).json({message:"Resume detils Updated !!", update})
  } catch (error) {
    console.log("Server error", error)
    res.status(500).json({message:"Server error", error})
  }

}


export { createResume, getResume, updateResume }