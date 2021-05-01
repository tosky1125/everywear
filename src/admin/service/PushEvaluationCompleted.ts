import * as admin from 'firebase-admin';
import { AbstractUserRepository } from '../../user/repository/AbstractUserRepository';

export class PushEvaluationCompleted {
  constructor(
    private readonly userRepository: AbstractUserRepository,
  ) {
  }

  async execute(userId:number) {
    const token = await this.userRepository.getDeviceToken(userId);
    const msg = {
      notification: {
        title: 'everywear',
        body: '당신의 패션 점수는? 클릭하고 지금 바로 확인하기',
      },
      token,
    };

    await admin.messaging().send(msg);
  }
}
