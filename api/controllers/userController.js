import { uploadImage } from "../config/storage.js";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
	try {
		const { image, genderPreference, ...otherData } = req.body;

		// Frontend yuborgan genderPreference qabul qilinmaydi.
		// Gender o'zgarsa preference ham avtomatik o'zgaradi.
		if (otherData.gender) {
			otherData.genderPreference = otherData.gender;
		}

		const updatedData = { ...otherData };

		if (image?.startsWith("data:image")) {
			try {
				const uploadResponse = await uploadImage(
					image,
					`user-${req.user.id}-${Date.now()}`
				);

				updatedData.image = uploadResponse.url;
			} catch (uploadError) {
				console.error("Error uploading image:", uploadError);

				return res.status(400).json({
					success: false,
					message: "Error uploading image",
				});
			}
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.user.id,
			updatedData,
			{
				new: true,
			}
		);

		return res.status(200).json({
			success: true,
			user: updatedUser,
		});
	} catch (error) {
		console.error("Error in updateProfile:", error);

		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
