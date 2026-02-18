import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";

const searchJobs = async (req, res) => {
  try {
    const {
      keyword,
      companyId,
      companyName,
      location,
      jobType,
      page = 1,
      limit = 10,
      sort = "latest"
    } = req.query;

    const query = {};

    // 🔹 Keyword search (title, requirements, location)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { requirements: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } }
      ];
    }

    // 🔹 CompanyId filter
    if (companyId) {
      query.company = companyId;
    }

    // 🔹 CompanyName filter
    if (companyName) {
      const company = await Company.findOne({
        name: { $regex: companyName, $options: "i" }
      });
      if (company) {
        query.company = company._id;
      } else {
        // Company name doesn't exist
        return res.status(200).json({
          totalJobs: 0,
          currentPage: 1,
          totalPages: 0,
          jobs: []
        });
      }
    }

    // 🔹 Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // 🔹 JobType filter
    if (jobType) {
      query.jobType = jobType;
    }

    // 🔹 Sorting
    let sortOption = {};
    if (sort === "latest") sortOption = { createdAt: -1 };
    if (sort === "salaryAsc") sortOption = { salary: 1 };
    if (sort === "salaryDesc") sortOption = { salary: -1 };

    // 🔹 Pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const jobs = await Job.find(query)
      .populate("company", "name location")
      .sort(sortOption)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalJobs = await Job.countDocuments(query);

    return res.status(200).json({
      totalJobs,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalJobs / limitNumber),
      jobs
    });

  } catch (error) {
    console.log("Search error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export { searchJobs };
