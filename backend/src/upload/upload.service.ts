import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: any): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'boost-marketplace',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        // Convert buffer to stream and pipe to cloudinary
        const stream = Readable.from(file.buffer);
        stream.pipe(uploadStream);
      });

      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new BadRequestException('Failed to upload image');
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
    }
  }
}
