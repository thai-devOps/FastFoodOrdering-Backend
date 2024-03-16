import jwt, { SignOptions } from 'jsonwebtoken'
import envConfig from '~/constants/config'
import { TOKEN_TYPE, UserRole, UserVerifyStatus } from '~/constants/enums'
import { TokenPayload } from '~/type'

const signToken = ({
  payload,
  secretKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | object | Buffer
  secretKey: string
  options?: SignOptions
}) =>
  new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secretKey, options, (err, token) => {
      if (err) return reject(err)
      return resolve(token as string)
    })
  })

const verifyToken = ({ token, secretKey }: { token: string; secretKey: string }) =>
  new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return reject(err)
      return resolve(decoded as TokenPayload)
    })
  })

const decodedToken = ({ token, tokenType }: { token: string; tokenType: TOKEN_TYPE }) => {
  const secretKey =
    tokenType === TOKEN_TYPE.ACCESS_TOKEN
      ? process.env.ACCESS_TOKEN_SECRET_KEY
      : tokenType === TOKEN_TYPE.REFRESH_TOKEN
        ? process.env.REFRESH_TOKEN_SECRET_KEY
        : process.env.EMAIL_VERIFY_TOKEN_SECRET_KEY
  return verifyToken({ token, secretKey: secretKey as string })
}
function signAccessToken({ _id, verify, role }: { _id: string; verify: UserVerifyStatus; role: UserRole }) {
  return jwtModule.signToken({
    payload: {
      _id,
      verify,
      token_type: TOKEN_TYPE.ACCESS_TOKEN,
      role
    },
    secretKey: envConfig.ACCESS_TOKEN_SECRET_KEY as string,
    options: {
      expiresIn: envConfig.ACCESS_TOKEN_LIFE
    }
  })
}
function signRefreshToken({
  _id,
  verify,
  exp,
  role
}: {
  _id: string
  verify: UserVerifyStatus
  exp?: number
  role: UserRole
}) {
  if (exp) {
    return jwtModule.signToken({
      payload: {
        _id,
        verify,
        token_type: TOKEN_TYPE.REFRESH_TOKEN,
        role
      },
      secretKey: envConfig.REFRESH_TOKEN_SECRET_KEY as string,
      options: {
        expiresIn: exp
      }
    })
  }
  return jwtModule.signToken({
    payload: {
      _id,
      verify,
      token_type: TOKEN_TYPE.REFRESH_TOKEN,
      role
    },
    secretKey: envConfig.REFRESH_TOKEN_SECRET_KEY as string,
    options: {
      expiresIn: envConfig.REFRESH_TOKEN_LIFE
    }
  })
}
function signEmailVerifyToken({ _id, verify, role }: { _id: string; verify: UserVerifyStatus; role?: UserRole }) {
  return jwtModule.signToken({
    payload: {
      _id,
      verify,
      token_type: TOKEN_TYPE.EMAIL_VERIFY_TOKEN,
      role
    },
    secretKey: envConfig.EMAIL_VERIFY_TOKEN_SECRET_KEY as string,
    options: {
      expiresIn: envConfig.EMAIL_VERIFY_TOKEN_LIFE
    }
  })
}
function signAccessRefreshToken({ _id, verify, role }: { _id: string; verify: UserVerifyStatus; role: UserRole }) {
  return Promise.all([signAccessToken({ _id, verify, role }), signRefreshToken({ _id, verify, role })])
}

const jwtModule = {
  signToken,
  verifyToken,
  decodedToken,
  signAccessToken,
  signRefreshToken,
  signEmailVerifyToken,
  signAccessRefreshToken
}
export default jwtModule
