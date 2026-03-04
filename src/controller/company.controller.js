import { Company } from "../models/company.model.js"
import { Job } from "../models/job.model.js"
import { Application } from "../models/applicaltion.model.js"
import mongoose from "mongoose"


const registerCompany = async (req, res) =>{
  
    try {
        const {companyName,website,location} = req.body
        if(!companyName || !website || !location){
          return res.status(400)/json({message:"Company name is required", success:flase})
        
        } 

        let company = await Company.findOne({name: companyName})

        if(company){
            return res.status(400).json({message:"Company name is allray exist", success :false})
        }
 
        company = await Company.create({
            name:companyName,
            userId: req.user._id,
            website,location
        })

        return res.status(200).json({message:"company registered successfully",company, success:true})

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


const updateCompanyDetails = async (req, res)=>{
    try {
        const {companyName,website,location, logo, description} = req.body
    
       
        const {id} = req.params
    
        let company = await Company.findOneAndUpdate( 
            {_id: id ,userId : req.user._id},
            {
                name :companyName , 
                website,
                description, 
                location, 
                logo 
            },
            {new: true}
        )
    
         
       return res.status(200).json({message:"Company detils Updated !!", company})
    
    } catch (error) {
        console.log("server error", error)
        return res.status(500).json({message:"server error", error})
    }
   
}

const deleteCompany = async (req,res)=>{

    try {
        const {id} = req.params
    
        const company = await Company.findOneAndDelete({_id: id, userId: req.user._id})
    
        if(!company){
            return res.status(400).json({message:"Company not found !!"})
        }
    
        return res.status(200).json({message:"Company details delete"})
    
    } catch (error) {
        console.log("Server error", error)
        return res.status(500).json("Server error", error)
    }
}

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
            { $match: { job: { $in: jobIds.map(id => mongoose.Types.ObjectId(id)) } } },
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



export { registerCompany, getRegisterCompany, updateCompanyDetails, deleteCompany, getCompanyWithApplications}