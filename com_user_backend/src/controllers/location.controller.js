import { locationService } from "../services/location.service.js";

export const locationController = {
  getCountries: async (req, res, next) => {
    try {
      const countries = await locationService.getCountries();
      res.json({ success: true, data: countries });
    } catch (error) {
      next(error);
    }
  },

  getStates: async (req, res, next) => {
    try {
      const { countryId } = req.params;
      const states = await locationService.getStatesByCountry(countryId);
      res.json({ success: true, data: states });
    } catch (error) {
      next(error);
    }
  },

  getCities: async (req, res, next) => {
    try {
      const { stateId } = req.params;
      const cities = await locationService.getCitiesByState(stateId);
      res.json({ success: true, data: cities });
    } catch (error) {
      next(error);
    }
  },
};
