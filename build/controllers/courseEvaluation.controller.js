"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluatePresentation = exports.submitPresentation = exports.getSinglePresentation = exports.getAllPresentations = exports.deletePresentation = exports.updatePresentation = exports.createPresentation = exports.evaluateAssignment = exports.submitAssignment = exports.upadateAssignment = exports.deleteAssignment = exports.getSingleAssignment = exports.getAllAssignments = exports.createAssignment = exports.getStudentProfile = void 0;
const assignment_model_1 = __importDefault(require("../models/evaluations/assignment.model"));
const finalScore_model_1 = __importDefault(require("../models/evaluations/finalScore.model"));
const marksDistribution_model_1 = __importDefault(require("../models/evaluations/marksDistribution.model"));
const ApiError_util_1 = __importDefault(require("../utils/ApiError.util"));
const ApiResponse_util_1 = __importDefault(require("../utils/ApiResponse.util"));
const findCourse_util_1 = __importDefault(require("../utils/findCourse.util"));
const courseTeacherTester_1 = __importDefault(require("../utils/courseTeacherTester"));
const courseStudentTester_util_1 = __importDefault(require("../utils/courseStudentTester.util"));
const assignmentResponse_model_1 = __importDefault(require("../models/evaluations/assignmentResponse.model"));
const presentation_model_1 = __importDefault(require("../models/evaluations/presentation.model"));
const getStudentProfile = async (req, res) => {
    const { _id } = req.student;
    if (!_id) {
        throw new ApiError_util_1.default(404, "Student not found");
    }
    const course = await (0, findCourse_util_1.default)(req.params.courseId);
    const studentProfile = await finalScore_model_1.default.findOne({
        student: _id,
        course: course._id,
    });
    if (!studentProfile) {
        throw new ApiError_util_1.default(404, "Student profile has not created yet.");
    }
    res.json(new ApiResponse_util_1.default(200, {
        studentProfile,
        course,
    }, "Successfully found teh student profile."));
};
exports.getStudentProfile = getStudentProfile;
// ASSIGNMENT PART
// when a teacher will create a new assignment for the course.
const createAssignment = async (req, res) => {
    const course = await (0, courseTeacherTester_1.default)({
        courseId: req.params.courseId,
        teacherEmail: req?.teacher?.email,
    });
    const marksDistribution = await marksDistribution_model_1.default.findOne({
        course: course._id,
    });
    if (!marksDistribution) {
        throw new ApiError_util_1.default(500, "Your course may not have marks distributed yet.");
    }
    if (marksDistribution.assignment.count === marksDistribution.assignment.taken) {
        throw new ApiError_util_1.default(400, "You have already taken the maximum number of assignments.");
    }
    const { assignmentTopic, startingTime, endingTime, description, type } = req.body;
    if (!assignmentTopic || !startingTime || endingTime || description || type) {
        throw new ApiError_util_1.default(400, "Incomplete assignment information.");
    }
    if (!["individual", "group"].includes(type)) {
        throw new ApiError_util_1.default(400, "Invalid type of assignment type given. It can either be individual or group.");
    }
    if (typeof assignmentTopic !== "string" || typeof description !== "string") {
        throw new ApiError_util_1.default(400, "Invalid type of data given for assignment title or description or both. We accept only string type of data for them.");
    }
    if (typeof startingTime !== "number" || typeof endingTime !== "number") {
        throw new ApiError_util_1.default(400, "Invalid type of data for assignment start and end time. we accept neumaric value of time in unix system.");
    }
    const createdAssignment = await assignment_model_1.default.create({
        topic: assignmentTopic,
        description,
        startingTime,
        endingTime,
        type,
        course: course._id,
    });
    if (!createdAssignment) {
        throw new ApiError_util_1.default(500, "There was a problem to create the assignment.");
    }
    const updatedMarksDistribution = marksDistribution_model_1.default.findByIdAndUpdate(marksDistribution._id, {
        $set: {
            assignment: {
                ...marksDistribution.assignment,
                taken: marksDistribution.assignment.taken + 1,
            },
        },
    });
    if (!updatedMarksDistribution) {
        await assignment_model_1.default.findByIdAndDelete(createdAssignment._id);
        throw new ApiError_util_1.default(500, "There was an error to update the marks distribution document.");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        assignment: createdAssignment,
        marksDistribution: updatedMarksDistribution,
    }, "Successfully created the assignment."));
};
exports.createAssignment = createAssignment;
// to get all the assignments of the course.
const getAllAssignments = async (req, res) => {
    const course = await (0, findCourse_util_1.default)(req.params.courseId);
    const assignments = await assignment_model_1.default.find({ course: course._id });
    if (!assignments) {
        throw new ApiError_util_1.default(404, "No assignments found for the course.");
    }
    // if the requester is a student, we need to give them the list of assignments, with how many of them are submitted.
    res.status(200).json(new ApiResponse_util_1.default(200, {
        assignments,
    }, "Successfully fetched all the assignments of the course."));
};
exports.getAllAssignments = getAllAssignments;
// get a single assignment by any user wanted.
const getSingleAssignment = async (req, res) => {
    const course = await (0, findCourse_util_1.default)(req.params.courseId);
    const { assignmentId } = req.params;
    if (!assignmentId) {
        throw new ApiError_util_1.default(400, "No assignment Id is provided.");
    }
    const assignment = await assignment_model_1.default.findById(assignmentId);
    if (!assignment) {
        throw new ApiError_util_1.default(404, "No assignment found with the given Id.");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        assignment,
    }, "Successfully fetched the assignment."));
};
exports.getSingleAssignment = getSingleAssignment;
// route handler for deleting a course's any assignment by a teacher
const deleteAssignment = async (req, res) => {
    const teacher = req?.teacher;
    const course = await (0, courseTeacherTester_1.default)({
        courseId: req.params.courseId,
        teacherEmail: teacher.email,
    });
    const { assignmentId } = req.params;
    if (!assignmentId) {
        throw new ApiError_util_1.default(400, "No assignment Id is provided.");
    }
    const assignment = await assignment_model_1.default.findById(assignmentId);
    if (!assignment) {
        throw new ApiError_util_1.default(404, "No assignment found with the given Id.");
    }
    const deletedAssignment = await assignment_model_1.default.findByIdAndDelete(assignmentId);
    if (!deletedAssignment) {
        throw new ApiError_util_1.default(500, "There was a problem to delete the assignment.");
    }
    const marksDistribution = (await marksDistribution_model_1.default.findOne({
        course: course._id,
    }));
    const updatedMarksDistribution = await marksDistribution_model_1.default.findOneAndUpdate({
        course: course._id,
    }, {
        $set: {
            assignment: {
                ...marksDistribution?.assignment,
                taken: marksDistribution?.assignment.taken - 1,
            },
        },
    }, { new: true });
    if (!updatedMarksDistribution) {
        throw new ApiError_util_1.default(500, "There was a problem to update the marks distribution.");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        success: true,
    }, "successfully deleted the assignment."));
};
exports.deleteAssignment = deleteAssignment;
// route handler for updating a course's any assignment by a teacher
const upadateAssignment = async (req, res) => {
    const course = await (0, courseTeacherTester_1.default)({
        courseId: req.params.courseId,
        teacherEmail: req?.teacher?.email,
    });
    const assignment = await assignment_model_1.default.findById(req.params.assignmentId);
    if (!assignment) {
        throw new ApiError_util_1.default(404, "No assignment found with the given Id.");
    }
    const { updatedInformation } = req.body;
    const updatedCourse = await assignment_model_1.default.findByIdAndUpdate(req.params.assignmentId, {
        $set: {
            ...updatedInformation,
        },
    }, { new: true });
    if (!updatedCourse) {
        throw new ApiError_util_1.default(500, "There was a problem to update the assignment.");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        updatedCourse,
    }, "Successfully updated the assignment."));
};
exports.upadateAssignment = upadateAssignment;
// route handler for submitting a response by a/multiple students.
const submitAssignment = async (req, res) => {
    const course = await (0, courseStudentTester_util_1.default)({
        courseId: req.params.courseId,
        studentId: req?.student?._id,
    });
    const { assignmentId } = req.params;
    const assignment = await assignment_model_1.default.findById(assignmentId);
    if (!assignment) {
        throw new ApiError_util_1.default(404, "No assignment found with the given Id.");
    }
    const alreadySubmitted = await assignmentResponse_model_1.default.findOne({
        assigmentId: assignment._id,
        students: [req?.student?._id],
    });
    if (alreadySubmitted) {
        throw new ApiError_util_1.default(403, "You have already submitted the assignment.");
    }
    // now we have a fresh response submitted that passed all validations. we can now save the response to the database.
};
exports.submitAssignment = submitAssignment;
const evaluateAssignment = async (req, res) => {
    const course = await (0, courseTeacherTester_1.default)({
        teacherEmail: req?.teacher?.email,
        courseId: req.params.courseId,
    });
    const assignmentResponse = await assignmentResponse_model_1.default.findById(req.params);
};
exports.evaluateAssignment = evaluateAssignment;
// PRESENTATION PART
// route handler for creating a new presentation by teacher.
const createPresentation = async (req, res) => {
    const course = await (0, courseTeacherTester_1.default)({
        courseId: req.params.courseId,
        teacherEmail: req?.teacher?.email,
    });
    const marksDistribution = await marksDistribution_model_1.default.findOne({
        course: course._id,
    });
    if (!marksDistribution) {
        throw new ApiError_util_1.default(500, "Your course may not have marks distributed yet.");
    }
    if (marksDistribution.presentation.count ===
        marksDistribution.presentation.taken) {
        throw new ApiError_util_1.default(400, "You have already taken the maximum number of presentations.");
    }
    const { presentationTopic, startingTime, endingTime, description } = req.body;
    if (!presentationTopic || !startingTime || endingTime || description) {
        throw new ApiError_util_1.default(400, "Incomplete presentation information.");
    }
    if (typeof presentationTopic !== "string" ||
        typeof description !== "string") {
        throw new ApiError_util_1.default(400, "Invalid type of data given for presentation title or description or both. We accept only string type of data for them.");
    }
    if (typeof startingTime !== "number" || typeof endingTime !== "number") {
        throw new ApiError_util_1.default(400, "Invalid type of data for presentation start and end time. we accept neumaric value of time in unix system.");
    }
    const createdPresentation = await presentation_model_1.default.create({
        topic: presentationTopic,
        description,
        startingTime,
        endingTime,
        course: course._id,
    });
    if (!createdPresentation) {
        throw new ApiError_util_1.default(500, "There was a problem to create the presentation.");
    }
    const updatedMarksDistribution = marksDistribution_model_1.default.findByIdAndUpdate(marksDistribution._id, {
        $set: {
            presentation: {
                ...marksDistribution.presentation,
                taken: marksDistribution.presentation.taken + 1,
            },
        },
    });
    if (!updatedMarksDistribution) {
        await presentation_model_1.default.findByIdAndDelete(createdPresentation._id);
        throw new ApiError_util_1.default(500, "There was an error to update the marks distribution document.");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        presentation: createdPresentation,
        marksDistribution: updatedMarksDistribution,
    }, "Successfully created the presentation."));
};
exports.createPresentation = createPresentation;
// route handler for updating a new presentation by teacher.
const updatePresentation = async (req, res) => {
    const course = await (0, courseTeacherTester_1.default)({
        courseId: req.params.courseId,
        teacherEmail: req?.teacher?.email,
    });
    const presentation = await presentation_model_1.default.findById(req.params.presentationId);
    if (!presentation) {
        throw new ApiError_util_1.default(404, "No presentation found with the given Id.");
    }
    const { updatedPresentationRequest } = req.body;
    const updatedPresentation = await presentation_model_1.default.findByIdAndUpdate(req.params.presentationId, {
        $set: {
            ...updatedPresentationRequest,
        },
    }, { new: true });
    if (!updatedPresentation) {
        throw new ApiError_util_1.default(500, "There was a problem to update the presentation.");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        updatedPresentation,
    }, "Successfully updated the presentation."));
};
exports.updatePresentation = updatePresentation;
// route handler for deleting a presentation by teacher
const deletePresentation = async (req, res) => {
    const course = await (0, courseTeacherTester_1.default)({
        teacherEmail: req.teacher?.email,
        courseId: req.params.courseId,
    });
    const presentation = await presentation_model_1.default.findById(req.params.presentationId);
    if (!presentation) {
        throw new ApiError_util_1.default(404, "No presentation found with the given Id.");
    }
    const deletedPresentation = await presentation_model_1.default.findByIdAndDelete(req.params.presentationId);
    if (!deletedPresentation) {
        throw new ApiError_util_1.default(500, "There was a problem to delete the presentation.");
    }
    const marksDistribution = (await marksDistribution_model_1.default.findOne({
        course: course._id,
    }));
    const updatedMarksDistribution = await marksDistribution_model_1.default.findOneAndUpdate({
        course: course._id,
    }, {
        $set: {
            presentation: {
                ...marksDistribution?.presentation,
                taken: marksDistribution?.presentation.taken - 1,
            },
        },
    }, { new: true });
    if (!updatedMarksDistribution) {
        throw new ApiError_util_1.default(500, "There was a problem to update the marks distribution.");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        success: true,
    }, "successfully deleted the presentation."));
};
exports.deletePresentation = deletePresentation;
// route handler for getting all the presentations of the course.
const getAllPresentations = async (req, res) => {
    const course = await (0, findCourse_util_1.default)(req.params.courseId);
    const presentations = await presentation_model_1.default.find({
        course: course._id,
    });
    if (!presentations) {
        throw new ApiError_util_1.default(404, "No presentation are there in this course.");
    }
    res
        .status(200)
        .json(new ApiResponse_util_1.default(200, { presentations }, "Successfully fetched all presentations."));
};
exports.getAllPresentations = getAllPresentations;
// route handler for getting a single presentation of the course. (two usecase, one for teacher and the other for students.)
const getSinglePresentation = async (req, res) => {
    const presentation = await presentation_model_1.default.findById(req.params.presentationId);
    if (!presentation) {
        throw new ApiError_util_1.default(404, "No presentation found with the given Id.");
    }
    res
        .status(200)
        .json(new ApiResponse_util_1.default(200, { presentation }, "Successfully fetched the presentation."));
};
exports.getSinglePresentation = getSinglePresentation;
// route handler for submitting a single presentation response.
const submitPresentation = async (req, res) => {
    const course = await (0, courseStudentTester_util_1.default)({
        courseId: req.params.courseId,
        studentId: req?.student?._id,
    });
    const { presentationId } = req.params;
    const presentation = await presentation_model_1.default.findById(presentationId);
    if (!presentation) {
        throw new ApiError_util_1.default(404, "No presentation found with the given Id.");
    }
    const alreadySubmitted = await assignmentResponse_model_1.default.findOne({
        presentationId: presentation._id,
        students: [req?.student?._id],
    });
    if (alreadySubmitted) {
        throw new ApiError_util_1.default(403, "You have already submitted the presentation.");
    }
    // now we have a fresh response submitted that passed all validations. we can now save the response to the database.
};
exports.submitPresentation = submitPresentation;
// route handler for evaluating a single presentation response.
const evaluatePresentation = async (req, res) => { };
exports.evaluatePresentation = evaluatePresentation;
