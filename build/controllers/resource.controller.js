"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.createResource = void 0;
const resource_model_1 = __importDefault(require("../models/resource.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const isValidUrl_1 = __importDefault(require("../utils/isValidUrl"));
// create a resource
const createResource = async (req, res) => {
    // validation of teacher and the ownership of course
    const { courses } = req.teacher;
    // validation of given information
    const { courseId, resourceName, resourceLink } = req.body;
    if (!courseId || !resourceName || !resourceLink) {
        throw new ApiError_1.default(400, "Incomplete request");
    }
    if (!courses.includes(courseId)) {
        throw new ApiError_1.default(403, "You are not the teacher of the course.");
    }
    (0, isValidUrl_1.default)(resourceLink); // testing if the given link is valid.
    // create new resource in database
    await resource_model_1.default.create({
        course: courseId,
        name: resourceName,
        teacher: req?.teacher?._id,
        link: resourceLink,
    });
    // create a new notification
    //  return all the resources of the course
    res.status(200).json(new ApiResponse_1.default(200, {
        resources: await resource_model_1.default.find({
            course: courseId,
        }),
    }, "Saved the resources successfully."));
};
exports.createResource = createResource;
const deleteResource = async (req, res) => {
    // validation of the teacher and if he own the course
    const { courses } = req.teacher;
    // get the resource id from body
    const resource = await resource_model_1.default.findById(req.body.resourceId);
    // validation of resource and validation of authorizaition.
    if (!resource) {
        throw new ApiError_1.default(404, "No resource found!");
    }
    if (!courses.includes(resource?.course)) {
        throw new ApiError_1.default(403, "You are not the teacher of the course.");
    }
    // delete the resource from the course
    await resource_model_1.default.deleteOne({
        link: resource.link,
    });
    // return all resources from the course.
    res.status(200).json(new ApiResponse_1.default(200, {
        resources: await resource_model_1.default.find({
            course: resource.course,
        }),
    }, "Successfully deleted the resource"));
};
exports.deleteResource = deleteResource;
