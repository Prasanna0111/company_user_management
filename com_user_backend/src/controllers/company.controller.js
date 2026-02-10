import * as companyService from "../services/company.service.js";

export const getAllCompanies = async (req, res, next) => {
  try {
    const { searchText, sortBy, page, limit } = req.body;
    const { companies, totalCount } = await companyService.listCompanies({
      searchText,
      sortBy,
      page,
      limit,
    });
    res.json({
      success: true,
      message: "Companies fetched successfully",
      data: companies,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCompaniesWithoutPagination = async (req, res, next) => {
  try {
    const companies = await companyService.listAllCompanies();
    res.json({
      success: true,
      message: "Companies fetched successfully",
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompany = async (req, res, next) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }
    res.json({
      success: true,
      message: "Company fetched successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req, res, next) => {
  try {
    const company = await companyService.createCompany(req.body);
    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const company = await companyService.updateCompany(req.params.id, req.body);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }
    res.json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const company = await companyService.deleteCompany(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }
    res.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const addUserToCompany = async (req, res, next) => {
  try {
    const userData = {
      ...req.body,
      company_id: req.params.id,
    };
    const user = await companyService.addUserToCompany(userData);
    res.status(201).json({
      success: true,
      message: "User created and added to company successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const removeUserFromCompany = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await companyService.removeUserFromCompany(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      message: "User removed from company successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
