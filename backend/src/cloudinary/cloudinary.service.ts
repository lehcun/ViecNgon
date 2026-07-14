import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    // Cấu hình Cloudinary ngay khi Service được khởi tạo
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Hàm upload file (nhận vào buffer từ Multer và trả về URL)
   */
  async uploadCvPdf(file: any): Promise<string> {
    try {
      // Chuyển đổi file buffer (nhị phân) sang định dạng Base64 để đẩy lên Cloudinary
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      // Gọi API của Cloudinary để upload
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'viecngon_cvs', // Tên thư mục nó sẽ tự tạo trên Cloudinary
        resource_type: 'auto', // Tự động nhận diện định dạng (PDF, PNG, JPG...)
      });

      // Trả về đường link bảo mật (HTTPS)
      return result.secure_url;
    } catch (error) {
      console.error('Lỗi khi upload lên Cloudinary:', error);
      throw new Error('Upload file lên Cloud thất bại!');
    }
  }
}
