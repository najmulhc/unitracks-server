import { UserRequest } from "../types";

// create a resource 
export const createResource = async (req: UserRequest, res: Response ) => {
    // validation of teacher and the ownership of course 
 
    // validation of given information 
    // create new resource in database 
    // create a new notification 
    //  return all the resources of the course
}

export const deleteResource = async (req: UserRequest, res: Response ) => {
    // validation of the teacher and if he own the course 
    // get the resource id from body 
    // delete the resource from the course
    // return all resources from the course.
}