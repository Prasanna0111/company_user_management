import { pool } from "../config/postgres.js";

export const locationService = {
  getCountries: async () => {
    const result = await pool.query(
      "SELECT id, name FROM countries ORDER BY name ASC",
    );
    return result.rows;
  },

  getStatesByCountry: async (countryId) => {
    const result = await pool.query(
      "SELECT id, name FROM states WHERE country_id = $1 ORDER BY name ASC",
      [countryId],
    );
    return result.rows;
  },

  getCitiesByState: async (stateId) => {
    const result = await pool.query(
      "SELECT id, name FROM cities WHERE state_id = $1 ORDER BY name ASC",
      [stateId],
    );
    return result.rows;
  },
};
