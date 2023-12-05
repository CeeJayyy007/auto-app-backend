// add unknown endpoint middleware
const unknownEndpoint = (request, response) => {
  const code = 404;
  response.status(code).send({
    success: false,
    statusCode: code,
    data: { error: 'unknown endpoint' }
  });
};

module.exports = unknownEndpoint;
