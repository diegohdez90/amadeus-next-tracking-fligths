import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config()

const sign = function(payload: string) {
  return jwt.sign({
    userId: payload
  }, process.env.JWT_SECRET as unknown as string, {
    expiresIn: '1h'
  })
}

const verify = function(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as unknown as string)
}

export {
  sign,
  verify
}

