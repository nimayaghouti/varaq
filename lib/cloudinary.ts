import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  secure: true,
});

export const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  folder: string,
) => {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `varaq/${folder}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteImageFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
  }
};
