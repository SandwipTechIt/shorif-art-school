export const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};

// export const errorHandler = (err, req, res, next) => {
//   const statusCode = err.status || 500;
//   const message = err.message || "Internal Server Error";
//   res.status(statusCode).json({
//     status: "error",
//     statusCode,
//     message,
//   });
// };
// export const notFoundHandler = (req, res, next) => {
//   res.status(404).json({
//     status: "error",
//     statusCode: 404,
//     message: "Not Found",
//   });
// };
// export const methodNotAllowedHandler = (req, res, next) => {
//   res.status(405).json({
//     status: "error",
//     statusCode: 405,
//     message: "Method Not Allowed",
//   });
// };
// export const badRequestHandler = (req, res, next) => {
//   res.status(400).json({
//     status: "error",
//     statusCode: 400,
//     message: "Bad Request",
//   });
// };
// export const internalServerErrorHandler = (err, req, res, next) => {
//   res.status(500).json({
//     status: "error",
//     statusCode: 500,
//     message: "Internal Server Error",
//   });
// };
// export const unauthorizedHandler = (req, res, next) => {
//   res.status(401).json({
//     status: "error",
//     statusCode: 401,
//     message: "Unauthorized",
//   });
// };
