import fs from 'fs';
import sharp from 'sharp';
import { v4 as uuidV4 } from 'uuid';
import { AbstractEvaluationRepository } from '../../evaluation/repository/AbstractEvaluationRepository';
import { PushEvaluationCompleted } from './PushEvaluationCompleted';
import { UserRepository } from '../../user/repository/UserRepository';
import { InvalidFileSizeError } from '../../file/error/InvalidFileSizeError';
import { InvalidFileError } from '../../file/error/InvalidFileError';
import { InvalidMimeTypeError } from '../../file/error/InvalidMimeTypeError';
import Logger from '../../infra/Logger';
import { FileStreamError } from '../../file/error/FileStreamError';
import { AwsSdk } from '../../infra/aws/AwsSdk';
import { S3UploadError } from '../../file/error/S3UploadError';
import { QueryExecutor } from '../../infra/database/QueryExecutor';
import { ApplicationConfig } from '../../infra/ApplicationConfig';

const FileSizeLimit = 30 * 1024 * 1024;

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
export class EvaluateUser {
  constructor(
    private readonly evaluationRepository: AbstractEvaluationRepository,
  ) {
  }

  async execute(req:any) {
    const {
      evaluationId, ...params
    } = req.body;

    await this.evaluationRepository.updateEvaluation({
      ...params,
    }, evaluationId);
    const push = new PushEvaluationCompleted(new UserRepository());
    await push.execute(req.body.userId);
  }
}
