const asyncHandler = require("express-async-handler");
const { Mechanic } = require("../models/Mechanic");
/**
 * @desc get all workshops
 * @route /api/search/workshop
 * @method GET
 * @access public
 */
module.exports.getAllWorkshopsCtrl = asyncHandler(async (req, res, next) => {
  const { province, car, service, page } = req.query;
  const pageSize = 10;
  const currentPage = parseInt(page, 10) || 1;
  let workshops;
  let count;
  const query = {};
  const skip = (currentPage - 1) * pageSize;
  try {
    if (province) query["workshopBranches.province"] = province;
    if (car) query.cars = { $in: car };
    if (service) query.workshopServices = { $in: service };

    workshops = await Mechanic.find(query)
      .select("-password")
      .populate("mechanicRatings")
      .populate("cars")
      .populate("workshopServices")
      .populate({
        path: "workshopBranches",
        populate: [
          { path: "province", select: "_id label value" },
          { path: "city", select: "_id label value" },
        ],
      })
      .skip(skip)
      .limit(pageSize);

    count = await Mechanic.countDocuments(query);

    res.status(200).json({ workshops, count });
  } catch (error) {
    next(error);
  }
});
