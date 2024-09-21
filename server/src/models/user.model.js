import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    // fullName: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    // profileImage: {
    //   type: {
    //     public_id: String,
    //     url: String,
    //   },
    //   required: true,
    // },
    // address: {
    //   type: String,
    //   required: true,
    // },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // answer: {
    //   type: String,
    //   // required: true,
    //   trim: true,
    // },
    // otp: {
    //   type: Number,
    // },
    // expireAt: {
    //   type: Date,
    // },
    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    console.log("Error occured at password encryption : ", error);
    process.exit(1);
  }
});

// userSchema.pre("save", async function (next) {
//   try {
//     if (!this.isModified("answer")) return next();
//     this.answer = await bcrypt.hash(this.answer, 10);

//     next();
//   } catch (error) {
//     console.log("Error occured at answer encryption : ", error);
//     process.exit(1);
//   }
// });

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// userSchema.methods.isAnswerCorrect = async function (answer) {
//   return await bcrypt.compare(answer, this.answer);
// };

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const User = mongoose.model("User", userSchema);

export { User };
