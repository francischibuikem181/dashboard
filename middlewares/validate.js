const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((details) => details.message);
      return res.status(400).json({
        errors: errorMessage,
      });
    }
    req.body = value;
    next();
  };
};

module.exports = validateRequest;
