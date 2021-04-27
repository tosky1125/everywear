import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { QueryExecutor } from '../database/QueryExecutor';
import { UserRepository } from '../../user/repository/UserRepository';
import JwtTokenGenerator from './JwtGenerator';
import { ApplicationConfig } from '../ApplicationConfig';
import { UserMapper } from '../../user/mapper/UserMapper';
import { User } from '../../user/domain/User';
import { AuthProvider } from '../enum/AuthProvider';

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ApplicationConfig.getJwtSecret(),
};
passport.serializeUser((user, done) => { done(null, user); });

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use('kakao', new KakaoStrategy({
  clientID: 'de2237bf43e6582ed18ac447ac76527b',
  clientSecret: '',
  callbackURL: 'http://localhost:3000/api/v1/auth/kakao/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const conn = QueryExecutor.getInstance().getReadConnection();
  let [user] = await conn('everywear_user as User')
    .select('User.*', 'Skin.skinType', 'Body.bodyType', 'Face.faceType', 't1.apple')
    .where({ provider: profile.provider, oAuthId: profile.id })
    .leftJoin('everywear_skinType as Skin', function () {
      this.on('User.skinTypeId', '=', 'Skin.skinTypeId');
    })
    .leftJoin('everywear_faceType as Face', function () {
      this.on('User.faceTypeId', '=', 'Face.faceTypeId');
    })
    .leftJoin('everywear_bodyType as Body', function () {
      this.on('User.bodyTypeId', '=', 'Body.bodyTypeId');
    })
    .leftJoin(conn.raw(`
      (SELECT 
        userId, SUM(value) AS apple 
      FROM 
        everywear_apple 
      GROUP BY userId) AS t1 
      ON 
        User.userId = t1.userId
      `));
  if (!user) {
    const [id] = await conn('everywear_user').insert({ provider: profile.provider, oAuthId: profile.id });
    const newUser = new User(id,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      Number(profile.id),
      profile.provider as AuthProvider,
      null);
    return done(null, {
      ...newUser,
      token: JwtTokenGenerator.get({
        userId: newUser.id,
        name: newUser.name,
        faceType: newUser.faceType,
        skinType: newUser.skinType,
        bodyType: newUser.bodyType,
        mail: newUser.mail,
        apple: newUser.apple,
      }),
    });
  }
  user = UserMapper.toService(user);
  return done(null, {
    ...user,
    token: JwtTokenGenerator.get({
      userId: user.id,
      name: user.name,
      faceType: user.faceType,
      skinType: user.skinType,
      bodyType: user.bodyType,
      mail: user.mail,
      apple: user.apple,
    }),
  });
}));

passport.use('userStrategy1.0', new JwtStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = await new UserRepository().getByMail(payload.id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

export default passport;
