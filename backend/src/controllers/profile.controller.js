import { AsyncHandler, ErrorHandler } from "../utils/handlers.js";
import { ChangePasswordSchema, EditProfileSchema } from "../validations/profile.schema.js";

// View profile
const viewProfile = AsyncHandler(async (req, res) => {
    // Get logged in user's data
    const loggedInUser = req.user;

    // Remove sensitive data
    loggedInUser.password = undefined;

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched user profile successfully",
        data: loggedInUser
    });
});

// Edit profile
const editProfile = AsyncHandler(async (req, res) => {
    // Validation of data
    const { age, gender, about, photoUrl, skills } = await EditProfileSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    // Get logged in user's data
    const loggedInUser = req.user;

    // Update the user data
    loggedInUser.age = age;
    loggedInUser.gender = gender;
    loggedInUser.about = about;
    loggedInUser.photoUrl = photoUrl;
    loggedInUser.skills = skills;

    // Save the user data
    await loggedInUser.save();

    // Remove sensitive data
    loggedInUser.password = undefined;

    // Return the response
    res.status(200).json({
        success: true,
        message: "Updated profile successfully",
        data: loggedInUser
    });
});

// Change password
const changePassword = AsyncHandler(async (req, res) => {
    // Validation of data
    const { oldPassword, newPassword } = await ChangePasswordSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    // Get logged in user's data
    const loggedInUser = req.user;

    // Validation of password
    const isValidPassword = await loggedInUser.validatePassword(oldPassword);
    if (!isValidPassword) {
        throw new ErrorHandler("Invalid Credentials", 401);
    }

    // Update the user password
    loggedInUser.password = newPassword;

    // Save the data
    await loggedInUser.save({ validateBeforeSave: false });

    // Return the response
    res.status(200).json({
        success: true,
        message: "Updated password successfully"
    });
});

export { changePassword, editProfile, viewProfile }; 