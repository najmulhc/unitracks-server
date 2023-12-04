const asyncHandler = (func) => async (req, res) => {
  try {
    await func(req, res);
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default asyncHandler;
