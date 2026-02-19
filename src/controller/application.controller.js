import { Application } from "../models/applicaltion.model.js"
import { Job } from "../models/job.model.js"
import { User } from "../models/user.models.js"

const applyJob = async (req, res) => {
    try {
        const userId = req.user._id
        const { jobId } = req.params

        // Validate job exists
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false })
        }

        // Check if already applied
        const existing = await Application.findOne({ job: jobId, application: userId })
        if (existing) {
            return res.status(400).json({ message: "You have already applied to this job", success: false })
        }

        // Create application
        const application = await Application.create({
            job: jobId,
            application: userId
        })

        // Add to Job applicants array
        job.applicants.push(application._id)
        await job.save()

        return res.status(201).json({ message: "Applied successfully", application, success: true })

    } catch (error) {
        console.log("Server error", error)
        return res.status(500).json({ message: "Server error", error, success: false })
    }
}

const getApplications = async (req, res) => {
    try {
        const userId = req.user._id

        // Get all applications by this user
        const applications = await Application.find({ application: userId })
            .populate({
                path: "job",
                select: "title description salary location jobType company",
                populate: {
                    path: "company",
                    select: "name website location"
                }
            })

        if (!applications || applications.length === 0) {
            return res.status(200).json({ message: "No applications found", applications: [], success: true })
        }

        return res.status(200).json({ message: "Applications retrieved", applications, success: true })

    } catch (error) {
        console.log("Server error", error)
        return res.status(500).json({ message: "Server error", error, success: false })
    }
}

const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params
        const { status } = req.body

        // Validate status
        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status", success: false })
        }

        // Check if user is recruiter/admin
        if (req.user.role !== "recruiter" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Only recruiter or admin can update application status", success: false })
        }

        // Update application
        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        ).populate("job application")

        if (!application) {
            return res.status(404).json({ message: "Application not found", success: false })
        }

        return res.status(200).json({ message: "Application status updated", application, success: true })

    } catch (error) {
        console.log("Server error", error)
        return res.status(500).json({ message: "Server error", error, success: false })
    }
}

const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params

        // Get job and verify user is the recruiter
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false })
        }

        if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized", success: false })
        }

        // Get all applications for this job
        const applications = await Application.find({ job: jobId })
            .populate({
                path: "application",
                select: "fullName email phone skills"
            })

        return res.status(200).json({ message: "Job applications retrieved", applications, success: true })

    } catch (error) {
        console.log("Server error", error)
        return res.status(500).json({ message: "Server error", error, success: false })
    }
}

export { applyJob, getApplications, updateApplicationStatus, getJobApplications }