import { Company } from "../models/company.model.js"
import { Job } from "../models/job.model.js"
import { Application } from "../models/applicaltion.model.js"
import mongoose from "mongoose"


const registerCompany = async (req, res) =>{
  
    try {
        
        const {name,description,website,location,industry,companySize,foundedYear,applications,totalJobsPosted,totalApplicationsReceived} = req.body
        if(!name || !website || !location){
          return res.status(400).json({message:"Company name is required", success:false})
        
        } 

  // Check if admin already has 3 companies
    const adminCompanyCount = await Company.countDocuments({ userId: req.user._id });
    if (adminCompanyCount >= 3) {
      return res.status(400).json({
        message: "Admin can only add up to 3 companies",
        success: false,
      });
    }

    // Check if company name already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: "Company name already exists", success: false });
    }
 
      const company = await Company.create({
            name,
            userId: req.user._id,
            website,location,description,
            industry,companySize,foundedYear,totalJobsPosted,totalApplicationsReceived,applications

        })

        return res.status(201).json({message:"company registered successfully",company, success:true})

    } catch (error) {
        console.log("server error", error)
        return res.status(500).json({message:"Server error" , error})
    }
}

const getRegisterCompany = async (req,res) =>{
    try {

       const allcompany = await Company.find() 

       return res.status(200).json({message:"get all company name", allcompany, success:true})

    } catch (error) {
        console.log("Server error", error)
        return res.status(500).json({message:"Server error", error})
    }
}

const getAdminCompany = async (req, res)=>{
    try {
const id = req.user._id
       const allcompany = await Company.find({userId: id}) 

       return res.status(200).json({message:"get all company name", allcompany, success:true})

    } catch (error) {
        console.log("Server error", error)
        return res.status(500).json({message:"Server error", error})
    }
}


const updateCompanyDetails = async (req, res)=>{
    try {
        const {companyName,website,location, description} = req.body
    
       
        const {id} = req.params
    
        let company = await Company.findOneAndUpdate( 
            {_id: id ,userId : req.user._id},
            {
                name :companyName , 
                website,
                description, 
                location, 
                
            },
            {new: true}
        )
    
         
       return res.status(200).json({message:"Company detils Updated !!", company})
    
    } catch (error) {
        console.log("server error", error)
        return res.status(500).json({message:"server error", error})
    }
   
}

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // Attempt to find and delete the company only if this admin added it
    const company = await Company.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!company) {
      // Could not delete because company doesn't exist or user is not the owner
      return res.status(403).json({
        message: "You are not allowed to delete this company or it does not exist",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Server error", error);
    return res.status(500).json({ message: "Server error", error, success: false });
  }
};
const getCompanyWithApplications = async (req, res) => {
    try {
        const { companyId } = req.params;

        // Get company details
        const company = await Company.findById(companyId);
        
        if (!company) {
            return res.status(404).json({ message: "Company not found", success: false });
        }

        // Get all job IDs for this company
        const jobIds = await Job.find({ company: companyId }).distinct("_id");

        // Count total applications for this company's jobs
        const totalApplications = await Application.countDocuments({ 
            job: { $in: jobIds } 
        });

        // Get breakdown by job
        const applicationsByJob = await Application.aggregate([
            { $match: { job: { $in: jobIds } } },
            { 
                $lookup: {
                    from: "jobs",
                    localField: "job",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },
            { $unwind: "$jobDetails" },
            { 
                $group: { 
                    _id: "$job", 
                    jobTitle: { $first: "$jobDetails.title" },
                    count: { $sum: 1 } 
                } 
            },
            { $sort: { count: -1 } }
        ]);

        return res.status(200).json({
            message: "Company details with applications count",
            success: true,
            company,
            totalApplications,
            applicationsByJob
        });

    } catch (error) {
        console.log("Server error", error);
        return res.status(500).json({ message: "Server error", success: false, error });
    }
};

// const getSingleCompany = async (req, res) => {
//   try {
//     const company = await Company.findById(req.params.id);
//     if (!company) {
//       return res.status(404).json({ message: "Company not found", success: false });
//     }
//     return res.status(200).json({ company, success: true });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };

const getSingleCompany = async (req, res) => {
  try {

    const company = await Company.findById(req.params.id)

    if (!company) {
      return res.status(404).json({ message: "Company not found", success: false })
    }

    const userId = req.user?._id

    const isLiked = company.likes.includes(userId)
    const isFollowing = company.followers.includes(userId)

    return res.status(200).json({
      company,
      isLiked,
      isFollowing,
      success: true
    })

  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false })
  }
}

const toggleLikeCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found", success: false });
    }

    const alreadyLiked = company.likes.includes(userId);

    let updatedCompany;

    if (alreadyLiked) {
      updatedCompany = await Company.findByIdAndUpdate(
        id,
        {
          $pull: { likes: userId },
          $inc: { totalLikes: -1 }
        },
        { new: true }
      );
    } else {
      updatedCompany = await Company.findByIdAndUpdate(
        id,
        {
          $addToSet: { likes: userId },
          $inc: { totalLikes: 1 }
        },
        { new: true }
      );
    }

    return res.status(200).json({
      message: alreadyLiked ? "Company unliked" : "Company liked",
      totalLikes: updatedCompany.totalLikes,
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const toggleFollowCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found", success: false });
    }

    const alreadyFollowing = company.followers.includes(userId);

    let updatedCompany;

    if (alreadyFollowing) {
      updatedCompany = await Company.findByIdAndUpdate(
        id,
        {
          $pull: { followers: userId },
          $inc: { totalFollowers: -1 }
        },
        { new: true }
      );
    } else {
      updatedCompany = await Company.findByIdAndUpdate(
        id,
        {
          $addToSet: { followers: userId },
          $inc: { totalFollowers: 1 }
        },
        { new: true }
      );
    }

    return res.status(200).json({
      message: alreadyFollowing ? "Unfollowed company" : "Followed company",
      totalFollowers: updatedCompany.totalFollowers,
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export { registerCompany,toggleLikeCompany, toggleFollowCompany, getRegisterCompany,getAdminCompany, updateCompanyDetails, getSingleCompany, deleteCompany, getCompanyWithApplications}