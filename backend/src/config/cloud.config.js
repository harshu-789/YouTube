// config/cloud.config.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// —— 1) Cloudinary config ——
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// —— 2) (Optional) demo upload wrapped in an async IIFE ——
;(async function demo() {
  try {
    const demo = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
      { public_id: 'shoes' }
    );
    console.log('Demo upload:', demo);
  } catch (err) {
    console.error('Demo error:', err);
  }
})();

// —— 3) Helper functions ——

export async function uploadVideoOnCloud(filepath) {
  const result = await cloudinary.uploader.upload(filepath, {
    resource_type: 'video',
    public_id:     `youtube_video_${Date.now()}`,
    folder:        'Youtube',
    eager:         [{ width: 400, height: 300, crop: 'pad' }],
  });
  fs.unlinkSync(filepath);
  return result;
}

export async function uploadThumbnailOnCloud(filepath) {
  const result = await cloudinary.uploader.upload(filepath, {
    resource_type: 'image',
    public_id:     `youtube_thumbnail_${Date.now()}`,
    folder:        'Youtube',
    eager:         [{ width: 400, height: 300, crop: 'pad' }],
  });
  fs.unlinkSync(filepath);
  return result;
}

export async function uploadProfileOnCloud(filepath) {
  const result = await cloudinary.uploader.upload(filepath, {
    resource_type: 'image',
    public_id:     `youtube_profile_${Date.now()}`,
    folder:        'Youtube',
    eager:         [{ width: 400, height: 300, crop: 'pad' }],
  });
  fs.unlinkSync(filepath);
  return result;
}
