import * as userService from "../services/user.service.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const {
      search,
      designation,
      active,
      companyId,
      sortBy,
      sortOrder,
      page,
      limit,
      globalFilter,
      noPagination,
    } = req.body;
    const result = await userService.listUsers({
      search,
      designation,
      active,
      companyId,
      sortBy,
      sortOrder,
      page,
      limit,
      globalFilter,
      noPagination,
    });
    res.json({
      success: true,
      message: "Users fetched successfully",
      allUsersCount: result.allUsersCount,
      allActiveUsersCount: result.allActiveUsersCount,
      allUnassignedUsersCount: result.allUnassignedUsersCount,
      data: result.users,
      pagination: {
        total: result.total,
        page: page || 1,
        limit: limit || 10,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const migrateUser = async (req, res, next) => {
  try {
    const { companyId } = req.body;
    const user = await userService.migrateUser(req.params.id, companyId);
    res.json({
      success: true,
      message: "User migrated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const user = await userService.deactivateUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      message: "User deactivated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
