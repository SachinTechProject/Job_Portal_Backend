import { Company } from "../models/company.model.js"


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

       const allcompany = await Company.find({userId :req.user._id}) 

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



export { registerCompany, getRegisterCompany, updateCompanyDetails, deleteCompany}