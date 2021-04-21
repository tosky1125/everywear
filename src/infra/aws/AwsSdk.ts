import AWS from 'aws-sdk';
import { ApplicationConfig } from '../ApplicationConfig';

export class AwsSdk {
  static async s3Upload(fileUuid, fileExtension, fileContent, acl) {
    const { accessKey, secretKey } = ApplicationConfig.getAwsKey();
    AWS.config.update({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      region: 'ap-northeast-2',
    });

    const S3 = new AWS.S3();
    return new Promise((resolve, reject) => {
      const param = {
        Bucket: ApplicationConfig.getS3Bucket(),
        Key: `${ApplicationConfig.getS3FilePath()}/${fileUuid}.${fileExtension}`,
        Body: fileContent,
        ACL: acl,
      };
      S3.upload(param, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
