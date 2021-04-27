import { UserSignResponseDto } from './UserSignResponseDto';

class AuthenticationDto {
  toClient(data : UserSignResponseDto) {
    return {
      token: data.token,
      name: data.user.name,
      bodyType: data.user.bodyType,
      skinType: data.user.skinType,
      faceType: data.user.faceType,
      mail: data.user.mail,
      birthday: data.user.birthday,
      apple: data.user.apple,
    };
  }
}
export default new AuthenticationDto();
