import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiResponces from "./../utils/ApiResponces.util.js";
import ApiError from "./../utils/ApiErrors.util.js";
import jwt from "jsonwebtoken";

export const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(
      "Error occured at generate access token and refresh token : ",
      error
    );
    return error;
  }
};

const signUpUser = asyncHandler(async (req, res, _) => {
  try {
    //Get details from users
    const { userName, email, password, role = "user" } = req.body;

    //Check validation
    if (
      [userName, email, password, role].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }

    //check the role of user
    if (!(role === "user" || role === "admin")) {
      throw new ApiError(400, "Please define the correct role");
    }

    //check user is exists or not
    const existsUser = await User.findOne({
      $or: [{ userName }, { email }],
    });

    if (existsUser) {
      throw new ApiError(400, "User is already exists");
    }

    //Local file path
    // if (!req?.file?.path) {
    //   throw new ApiError(400, "Profile image is required");
    // }
    // const localFilePath = req?.file?.path;

    // const cloudinaryObject = await uploadOnCloudinary(localFilePath);
    // if (!cloudinaryObject) {
    //   throw new ApiError(400, "Cloudinary upload error");
    // }
    // const { public_id, url } = cloudinaryObject;

    const user = await User.create({
      userName: userName.toLowerCase(),
      email,
      password,
      role,
    });

    if (!user) {
      throw new ApiError(400, "User not created ");
    }

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(400, "Something went wrong");
    }

    // user.otp = generateRandom6DigitNumber();
    // user.expireAt = Date.now() + 3 * 60 * 1000;
    // await user.save({ validateBeforeSave: false });

    // const userEmail = user?.email;
    // const userOTP = user?.otp;
    // await sendMail(userEmail, "Email sends for verification", userOTP);

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(createdUser?._id);

    const options = {
      // httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .cookie("role", createdUser?.role, options)
      .json(
        new ApiResponces(
          200,
          { user: createdUser, accessToken, refreshToken },
          "User Registerd  successfully"
        )
      );
  } catch (error) {
    const errorMessage = error.message;

    return res
      .status(400)
      .json(
        new ApiResponces(
          400,
          { errorMessage },
          "Some error occured in regitration"
        )
      );
  }
});

const logInUser = asyncHandler(async (req, res) => {
  console.log("Hello");

  const { userName, email, password } = req.body;

  if (!(userName || email)) {
    throw new ApiError(400, "Username or Email is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    return res
      .status(400)
      .json(new ApiResponces(400, { value: true }, "User is not Exists"));
  }
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res
      .status(400)
      .json(new ApiResponces(400, { value: true }, "Password is not correct"));
  }

  // if (!user?.isVerified) {
  //   return res
  //     .status(400)
  //     .json(
  //       new ApiResponces(400, { verification: true }, "User is not verified")
  //     );
  // }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    // httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .cookie("role", loggedInUser?.role, options)
    .json(
      new ApiResponces(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const userLoggOut = asyncHandler(async (req, res, _) => {
  const userId = req?.user?._id;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $unset: { refreshToken: null },
    },
    {
      new: true,
    }
  );

  if (!user) {
    throw new ApiError(400, "Unauthorized request");
  }

  const options = {
    // httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .clearCookie("role", options)
    .json(new ApiResponces(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req?.cookies?.refreshToken || req?.body.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(400, "Invalid refresh token");
  }

  const decodedToken = jwt.verify(
    incommingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (incommingRefreshToken !== user.refreshToken) {
    throw new ApiError(400, "Token is expired or used");
  }

  const options = {
    // httpOnly: true,
    secure: true,
  };

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user?._id);
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponces(
        200,
        { accessToken, refreshToken },
        "Token generate successfully"
      )
    );
});

export { signUpUser, logInUser, userLoggOut, refreshAccessToken };
