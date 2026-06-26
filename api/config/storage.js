import cloudinary from "./cloudinary.js";
import imagekit from "./imagekit.js";

const provider = process.env.STORAGE_PROVIDER || "imagekit";

export const uploadImage = async (file, fileName) => {
	if (provider === "cloudinary") {
		const result = await cloudinary.uploader.upload(file);

		return {
			url: result.secure_url,
			id: result.public_id,
		};
	}

	if (provider === "imagekit") {
		const result = await imagekit.upload({
			file,
			fileName,
		});

		return {
			url: result.url,
			id: result.fileId,
		};
	}

	throw new Error(`Unknown storage provider: ${provider}`);
};

export const deleteImage = async (id) => {
	if (provider === "cloudinary") {
		return cloudinary.uploader.destroy(id);
	}

	if (provider === "imagekit") {
		return imagekit.deleteFile(id);
	}

	throw new Error(`Unknown storage provider: ${provider}`);
};
