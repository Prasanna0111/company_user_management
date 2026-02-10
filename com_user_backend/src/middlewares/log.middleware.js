export const logMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
