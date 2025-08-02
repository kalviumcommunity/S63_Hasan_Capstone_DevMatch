import { AsyncHandler, ErrorHandler } from "../utils/handlers.js";
import { LoginSchema, SignupSchema } from "../validations/auth.schema.js";
import { UserModel } from "../models/user.model.js";

// Signup
const signup = AsyncHandler(async (req, res) => {
    // Validation of data
    const { name, email, password, age, gender } = await SignupSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    // Check if the user already exists in the db or not
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
        throw new ErrorHandler("User already exists", 409);
    }

    // Create a new user
    const newUser = await UserModel.create({
        name,
        email,
        password,
        age,
        gender
    });

    // Remove sensitive data
    newUser.password = undefined;

    // Return the response
    res.status(201).json({
        success: true,
        message: "Registered successfully",
        data: newUser
    });
});

// Login
const login = AsyncHandler(async (req, res) => {
    // Validation of data
    const { email, password } = await LoginSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

    // Check if the user exists in the db or not
    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Validation of password
    const isValidPassword = await userExists.validatePassword(password);
    if (!isValidPassword) {
        throw new ErrorHandler("Invalid Credentials", 401);
    }

    // Generate jwt
    const token = userExists.generateJWT();

    // Remove sensitive data
    userExists.password = undefined;

    // Set the cookie and return the response
    res.cookie("devmatchToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
        .status(200)
        .json({
            success: true,
            message: "Logged in successfully",
            data: userExists
        });
});

// Logout
const logout = (_req, res) => {
    // Remove the cookie and return the response
    res.clearCookie("devmatchToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
        .status(200)
        .json({
            success: true,
            message: "Logged out successfully"
        });
};

export { signup, login, logout }; 