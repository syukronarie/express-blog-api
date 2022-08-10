const httpStatus = require("http-status");

const isSuccess = (statusCode) => statusCode < 400;

const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    success: isSuccess(statusCode),
    ...data,
  });
};

const sendResponseWithData = (res, data, statusCode = httpStatus.OK) => {
  sendResponse(res, statusCode, {
    data,
  });
};

const sendResponseWithPaginateData = (res, data, pagination, statusCode = httpStatus.OK) => {
  sendResponse(res, statusCode, {
    data,
    pagination,
  });
};

module.exports = {
  sendResponse,
  sendResponseWithData,
  sendResponseWithPaginateData,
};
