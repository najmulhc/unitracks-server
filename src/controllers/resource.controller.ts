import Course from "../models/course.model";
import Resource from "../models/resource.model";
import { TeacherType, UserRequest } from "../types";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import isValidUrl from "../utils/isValidUrl";
import { Response } from "express";

// create a resource
export const createResource = async (req: UserRequest, res: Response) => {
  // validation of teacher and the ownership of course
  const { courses } = req.teacher as TeacherType;
  // validation of given information
  const { courseId, resourceName, resourceLink } = req.body;

  if (!courseId || !resourceName || !resourceLink) {
    throw new ApiError(400, "Incomplete request");
  }

  if (!courses.includes(courseId)) {
    throw new ApiError(400, "You are not the teacher of the course.");
  }

  isValidUrl(resourceLink); // testing if the given link is valid.

  // create new resource in database

  await Resource.create({
    course: courseId,
    name: resourceName,
    teacher: req?.teacher?._id,
    link: resourceLink,
  });

  // create a new notification
  //  return all the resources of the course
  res.status(200).json(
    new ApiResponse(
      200,
      {
        resources: await Resource.find({
          course: courseId,
        }),
      },
      "Saved the resources successfully.",
    ),
  );
};

export const deleteResource = async (req: UserRequest, res: Response) => {
  // validation of the teacher and if he own the course
  const { courses } = req.teacher as TeacherType;
  // get the resource id from body
  const resource = await Resource.findById(req.body.resourceId);

  // validation of resource and validation of authorizaition.
  if (!resource) {
    throw new ApiError(404, "No resource found!");
  }
  if (!courses.includes(resource?.course)) {
    throw new ApiError(400, "You are not the teacher of the course.");
  }

  // delete the resource from the course
  await Resource.deleteOne({
    link: resource.link,
  });

  // return all resources from the course.
  res.status(200).json(
    new ApiResponse(
      200,
      {
        resources: await Resource.find({
          course: resource.course,
        }),
      },
      "Successfully deleted the resource",
    ),
  );
};
