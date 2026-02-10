import { pool } from "../config/postgres.js";
import { getCoordinates } from "../utils/getCoords.js";
import { generateId } from "../utils/generateId.js";

export const listCompanies = async (filters = {}) => {
  const { searchText, sortBy, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  let query = `
        SELECT c.*, 
        (SELECT COUNT(*) FROM users u WHERE u.company_id = c.id) as user_count,
        COUNT(*) OVER() as total_count
        FROM companies c`;
  const values = [];
  const conditions = [];

  if (searchText) {
    values.push(`%${searchText.trim()}%`);
    conditions.push(
      `(c.name ILIKE $${values.length} OR c.address ILIKE $${values.length})`,
    );
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  switch (sortBy) {
    case "namedesc":
      query += " ORDER BY c.name DESC";
      break;
    case "nameasc":
      query += " ORDER BY c.name ASC";
      break;
    case "oldest":
      query += " ORDER BY c.updated_at ASC";
      break;
    case "recent":
    default:
      query += " ORDER BY c.updated_at DESC";
      break;
  }

  values.push(limit);
  query += ` LIMIT $${values.length}`;
  values.push(offset);
  query += ` OFFSET $${values.length}`;

  const result = await pool.query(query, values);
  return {
    companies: result.rows,
    totalCount: result.rows[0]?.total_count
      ? parseInt(result.rows[0].total_count)
      : 0,
  };
};

export const listAllCompanies = async () => {
  const result = await pool.query(
    "SELECT * FROM companies order by created_at desc",
  );
  return result.rows;
};

export const getCompanyById = async (id) => {
  const result = await pool.query(
    `
        SELECT c.*, 
        (SELECT COUNT(*) FROM users u WHERE u.company_id = c.id) as user_count
        FROM companies c WHERE c.id = $1
    `,
    [id],
  );
  return result.rows[0];
};

export const createCompany = async (companyData) => {
  const { name, address } = companyData;
  const id = generateId();
  const existingCompany = await pool.query(
    "SELECT * FROM companies WHERE name = $1 AND address = $2",
    [name, address],
  );
  if (existingCompany.rows.length > 0) {
    throw new Error("Company with this name and address already exists");
  }
  const coords = await getCoordinates(address);
  const lat = coords ? coords.lat : null;
  const lon = coords ? coords.lon : null;

  const result = await pool.query(
    "INSERT INTO companies (id, name, address, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [id, name.trim(), address.trim(), lat, lon],
  );
  return result.rows[0];
};

export const updateCompany = async (id, updateData) => {
  const currentResult = await pool.query(
    "SELECT * FROM companies WHERE id = $1",
    [id],
  );
  if (currentResult.rows.length === 0) return null;

  const current = currentResult.rows[0];
  const name = updateData.name || current.name;
  const address = updateData.address || current.address;

  let lat = current.latitude;
  let lon = current.longitude;

  if (updateData.address && updateData.address !== current.address) {
    const coords = await getCoordinates(updateData.address);
    if (coords) {
      lat = coords.lat;
      lon = coords.lon;
    }
  }

  const result = await pool.query(
    "UPDATE companies SET name = $1, address = $2, latitude = $3, longitude = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
    [name.trim(), address.trim(), lat, lon, id],
  );
  return result.rows[0];
};

export const deleteCompany = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE users SET company_id = NULL, active = false, updated_at = CURRENT_TIMESTAMP WHERE company_id = $1",
      [id],
    );

    const result = await client.query(
      "DELETE FROM companies WHERE id = $1 RETURNING *",
      [id],
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export const addUserToCompany = async (userData) => {
  const { first_name, last_name, email, designation, dob, active, company_id } =
    userData;
  const isEmailExists = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  if (isEmailExists.rows.length > 0) {
    throw new Error("Email already exists");
  }
  const id = generateId();
  const result = await pool.query(
    "INSERT INTO users (id, first_name, last_name, email, designation, dob, active, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [
      id,
      first_name,
      last_name,
      email,
      designation,
      dob,
      active !== undefined ? active : true,
      company_id,
    ],
  );
  return result.rows[0];
};

export const removeUserFromCompany = async (userId) => {
  const result = await pool.query(
    "UPDATE users SET company_id = NULL WHERE id = $1 RETURNING *",
    [userId],
  );
  return result.rows[0];
};
