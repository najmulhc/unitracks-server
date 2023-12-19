import ApiError from "./ApiError";

const isValidUrl = (str: string) => {
  const regex =
    /^(ftp|http|https):\/\/(?:www\.)?([a-zA-Z0-9-]+\.)([a-zA-Z]{2,})(\/[^\s]*)?$/;
  const result: Boolean = regex.test(str);
  if (!result) {
    throw new ApiError(400, "Invalid link, give a proper one.");
  } else {
    return result;
  }
};

export default isValidUrl;
