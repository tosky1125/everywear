import * as admin from 'firebase-admin';
import { AbstractUserRepository } from '../../user/repository/AbstractUserRepository';
import firebaseCert from '../../infra/firebase/asdfasd-250c0-firebase-adminsdk-k7nlj-4bf04bc284.json';

export class PushEvaluationCompleted {
  constructor(
    private readonly userRepository: AbstractUserRepository,
  ) {
  }

  async execute(userId:number) {
    const token = await this.userRepository.getDeviceToken(userId);
    console.log(token);
    const msg = {
      notification: {
        title: 'everywear',
        body: '당신의 패션 점수는? 클릭하고 지금 바로 확인하기',
      },
      token,
    };
    admin.initializeApp({
      credential: admin.credential.cert(firebaseCert),
    });
    await admin.messaging().send(msg);
  }
}
