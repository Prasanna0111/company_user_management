import express from "express";
import { locationController } from "../controllers/location.controller.js";

const router = express.Router();

router.get("/countries", locationController.getCountries);
router.get("/states/:countryId", locationController.getStates);
router.get("/cities/:stateId", locationController.getCities);

export default router;
