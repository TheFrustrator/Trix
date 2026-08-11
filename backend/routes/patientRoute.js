import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getPatientAccessRequests,
  updateAccessRequestStatus,
} from "../controllers/patientController.js";

const patientRouter = express.Router();

patientRouter.get("/access-requests", userAuth, getPatientAccessRequests);
patientRouter.post("/update-request-status", userAuth, updateAccessRequestStatus);

export default patientRouter;