import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const { file } = await req.json();

    // Validate if file is provided
    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // Upload file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: 'uploads', // Folder name in Cloudinary
      resource_type: 'auto', // Automatically detects file type
    });

    // Respond with the URL of the uploaded file
    return NextResponse.json({ url: uploadResponse.secure_url }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
