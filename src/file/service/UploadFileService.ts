import fs from 'fs';
import { Request } from 'express';
import sharp from 'sharp';
import { v4 as uuidV4 } from 'uuid';
import Logger from '../../infra/Logger';
import { QueryExecutor } from '../../infra/database/QueryExecutor';
import { ApplicationConfig } from '../../infra/ApplicationConfig';
import { AwsSdk } from '../../infra/aws/AwsSdk';
import { FileNotExistError } from '../error/FileNotExistError';
import { InvalidFileSizeError } from '../error/InvalidFileSizeError';
import { InvalidFileError } from '../error/InvalidFileError';
import { InvalidMimeTypeError } from '../error/InvalidMimeTypeError';
import { S3UploadError } from '../error/S3UploadError';
import { FileStreamError } from '../error/FileStreamError';
import { FileDBInsertError } from '../error/FileDBInsertError';
import { UserNotExistError } from '../../auth/error/UserNotExistError';

const FileSizeLimit = 50 * 1024 * 1024;

function mimeTypeToExtension(mimeType:string): string {
  switch (mimeType) {
    case ('image/gif'):
      return 'gif';
    case ('image/png'):
      return 'png';
    case ('image/jpeg'):
      return 'jpg';
    default:
      return 'webp';
  }
}

export class UploadFileService {
  async execute(request:Request) {
    if (request.file) {
      const {
        mimetype, path, originalname, size,
      } = request.file;

      if (size > FileSizeLimit) {
        throw new InvalidFileSizeError();
      }

      if (!mimetype || !path || !originalname || !size) {
        throw new InvalidFileError();
      }

      const extension = mimeTypeToExtension(mimetype);

      if (!extension) {
        throw new InvalidMimeTypeError();
      }
      const fileStream = fs.createReadStream(path).pipe(sharp().rotate().toBuffer((error) => {
        if (error) {
          Logger.error(error);
          Logger.info(request.file);
          return false;
        }
      }));
      if (!fileStream) {
        throw new FileStreamError();
      }

      const fileUuid = uuidV4();
      const fileAcl = 'public-read';
      const uploadResult = await AwsSdk.s3Upload(fileUuid, extension, fileStream, fileAcl);

      if (!uploadResult) {
        throw new S3UploadError();
      }

      const conn = QueryExecutor.getInstance().getWriteConnection();
      const [queryResult] = await conn('everywear_upload_files').insert({
        userId: 0, // TODO: session 존재 시에는 userId 값이 들어 갈 수 있어야 함
        uploadDate: new Date(),
        fileUuid,
        fileUrl: uploadResult.Location,
        fileName: originalname,
        fileSize: size,
        mimeType: mimetype,
        auth: fileAcl,
        bucket: ApplicationConfig.getS3Bucket(),
        key: `${ApplicationConfig.getS3FilePath()}/${fileUuid}.${extension}`,
      });

      const insertResult = queryResult ? {
        fileId: queryResult,
        uploadDate: new Date(),
        fileUuid,
        fileUrl: uploadResult.Location,
        fileName: originalname,
        fileSize: size,
        mimeType: mimetype,
        auth: fileAcl,
        bucket: ApplicationConfig.getS3Bucket(),
        key: `${ApplicationConfig.getS3FilePath()}/${fileUuid}.${extension}`,
      } : null;

      if (!insertResult) {
        throw new FileDBInsertError();
      }

      fs.unlink(path, () => {});

      return insertResult;
    }
    return {
      fileId: null,
      uploadDate: new Date(),
      fileUrl: null,
      fileName: null,
      fileSize: null,
      mimeType: null,
      auth: null,
      bucket: ApplicationConfig.getS3Bucket(),
      key: `${ApplicationConfig.getS3FilePath()}/${null}.${null}`,
    };
  }
}
