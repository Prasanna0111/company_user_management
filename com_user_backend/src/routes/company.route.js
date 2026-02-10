import express from "express";
import * as companyController from "../controllers/company.controller.js";

const router = express.Router();

router.post("/", companyController.getAllCompanies);
router.get("/all", companyController.getAllCompaniesWithoutPagination);
router.get("/:id", companyController.getCompany);
router.post("/create", companyController.createCompany);
router.patch("/:id", companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);
router.post("/:id/users", companyController.addUserToCompany);
router.delete("/:id/users", companyController.removeUserFromCompany);

export default router;
