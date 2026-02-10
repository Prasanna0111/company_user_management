import { pool } from "../config/postgres.js";
import { generateId } from "../utils/generateId.js";

export const listUsers = async (filters = {}) => {
  const {
    search,
    designation,
    active,
    companyId,
    globalFilter,
    sortBy,
    sortOrder,
    page = 1,
    limit = 10,
  } = filters;

  const values = [];
  const conditions = [];

  let query = `
    SELECT u.*, c.name AS company_name
    FROM users u
    LEFT JOIN companies c ON u.company_id = c.id
  `;

  if (search) {
    values.push(`%${search.trim()}%`);
    conditions.push(
      `(u.first_name ILIKE $${values.length}
        OR u.last_name ILIKE $${values.length}
        OR u.email ILIKE $${values.length})`,
    );
  }

  if (designation) {
    values.push(designation.trim());
    conditions.push(`u.designation = $${values.length}`);
  }

  if (companyId) {
    values.push(companyId);
    conditions.push(`u.company_id = $${values.length}`);
  }

  if (globalFilter && globalFilter !== "all") {
    switch (globalFilter) {
      case "unassigned":
        conditions.push(`u.company_id IS NULL`);
        break;
      case "inactive":
        conditions.push(`u.active = false`);
        break;
      case "active":
        conditions.push(`u.active = true`);
        break;
    }
  } else if (active !== undefined && active !== null && active !== "") {
    values.push(active === "true" || active === true);
    conditions.push(`u.active = $${values.length}`);
  }

  if (conditions.length) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const countQuery = query.replace(
    "SELECT u.*, c.name AS company_name",
    "SELECT COUNT(*)",
  );
  const countResult = await pool.query(countQuery, values);
  const total = parseInt(countResult.rows[0].count);

  const allowedSortColumns = {
    first_name: "u.first_name",
    last_name: "u.last_name",
    email: "u.email",
    designation: "u.designation",
    active: "u.active",
    created_at: "u.created_at",
    updated_at: "u.updated_at",
    company_name: "company_name",
  };

  const sortCol = allowedSortColumns[sortBy] || "u.updated_at";
  const order = sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  query += ` ORDER BY ${sortCol} ${order}`;

  const offset = (page - 1) * limit;
  values.push(limit);
  query += ` LIMIT $${values.length}`;
  values.push(offset);
  query += ` OFFSET $${values.length}`;

  const result = await pool.query(query, values);

  const allUsersCount = parseInt(
    (await pool.query("SELECT COUNT(*) FROM users")).rows[0].count,
  );
  const allActiveUsersCount = parseInt(
    (await pool.query("SELECT COUNT(*) FROM users WHERE active = true")).rows[0]
      .count,
  );
  const allUnassignedUsersCount = parseInt(
    (await pool.query("SELECT COUNT(*) FROM users WHERE company_id IS NULL"))
      .rows[0].count,
  );

  return {
    users: result.rows,
    total,
    allUsersCount,
    allActiveUsersCount,
    allUnassignedUsersCount,
  };
};

export const getUserById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const createUser = async (userData) => {
  const { first_name, last_name, email, designation, dob, active, company_id } =
    userData;
  const id = generateId();
  const result = await pool.query(
    "INSERT INTO users (id, first_name, last_name, email, designation, dob, active, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [
      id,
      first_name?.trim(),
      last_name?.trim(),
      email?.trim(),
      designation?.trim(),
      dob,
      active !== undefined ? active : true,
      company_id || null,
    ],
  );
  return result.rows[0];
};

export const updateUser = async (id, updateData) => {
  const currentResult = await pool.query("SELECT * FROM users WHERE id = $1", [
    id,
  ]);
  if (currentResult.rows.length === 0) return null;

  const current = currentResult.rows[0];
  const first_name = (updateData.first_name || current.first_name)?.trim();
  const last_name = (updateData.last_name || current.last_name)?.trim();
  const email = (updateData.email || current.email)?.trim();
  const designation =
    updateData.designation !== undefined
      ? updateData.designation?.trim()
      : current.designation?.trim();
  const dob = updateData.dob || current.dob;
  const active =
    updateData.active !== undefined ? updateData.active : current.active;

  const result = await pool.query(
    "UPDATE users SET first_name = $1, last_name = $2, email = $3, designation = $4, dob = $5, active = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *",
    [first_name, last_name, email, designation, dob, active, id],
  );
  return result.rows[0];
};

export const deleteUser = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};

export const migrateUser = async (userId, targetCompanyId) => {
  const result = await pool.query(
    "UPDATE users SET company_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [targetCompanyId || null, userId],
  );
  return result.rows[0];
};

export const deactivateUser = async (id) => {
  const result = await pool.query(
    "UPDATE users SET active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};
