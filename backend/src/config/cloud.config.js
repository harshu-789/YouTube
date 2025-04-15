
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: 'process.env.CLOUDINARY_API_NAME', 
  api_key: 'process.env.CLOUDINARY_API_KEY', 
  api_secret: 'process.env.CLOUDINARY_API_SECRET' // Click 'View API Keys' above to copy your API secret
});



const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
// Function to upload a video to Cloudinary
async function uploadVideoOnCloud(filepath) {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: 'video', // Indicate that this is a video file
      public_id: `youtube_video_${Date.now()}`, // Use a timestamp-based public ID to ensure uniqueness
      folder: 'Youtube', // Store videos in the 'Youtube' folder
      eager: [{ width: 400, height: 300, crop: 'pad' }] // Optional: Transcoding options (resize)
    });

    // Delete the local video file after uploading
    fs.unlinkSync(filepath); // Synchronously unlink (delete) the file

    // Returning the result, which includes video metadata (URL, format, etc.)
    return result; 
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error; // Rethrow the error for further handling
  }
}

// Function to upload a thumbnail to Cloudinary
async function uploadThumbnailOnCloud(filepath) {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: 'image', // Correct resource type for images (thumbnails)
      public_id: `youtube_thumbnail_${Date.now()}`, // Use a timestamp-based public ID to ensure uniqueness
      folder: 'Youtube', // Store images in the 'Youtube' folder
      eager: [{ width: 400, height: 300, crop: 'pad' }] // Optional: Transcoding options (resize)
    });

    // Delete the local thumbnail file after uploading
    fs.unlinkSync(filepath); // Synchronously unlink (delete) the file

    // Returning the result, which includes image metadata (URL, format, etc.)
    return result;
  } catch (error) {
    console.error("Error uploading thumbnail:", error);
    throw error; // Rethrow the error for further handling
  }
}

// Function to upload a profile picture to Cloudinary
async function uploadProfileOnCloud(filepath) {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: 'image', // Correct resource type for images (profile pictures)
      public_id: `youtube_profile_${Date.now()}`, // Use a timestamp-based public ID to ensure uniqueness
      folder: 'Youtube', // Store images in the 'Youtube' folder
      eager: [{ width: 400, height: 300, crop: 'pad' }] // Optional: Transcoding options (resize)
    });

    // Delete the local profile picture file after uploading
    fs.unlinkSync(filepath); // Synchronously unlink (delete) the file

    // Returning the result, which includes image metadata (URL, format, etc.)
    return result;
  } catch (error) {
    console.error("Error uploading profile:", error);
    throw error; // Rethrow the error for further handling
  }
}

export { uploadVideoOnCloud, uploadThumbnailOnCloud, uploadProfileOnCloud };
