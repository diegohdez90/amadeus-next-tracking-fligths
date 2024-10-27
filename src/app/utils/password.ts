import bcrypt from 'bcrypt';


function encrypt (pwd: string) {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(pwd, salt)
  return hash
}

function decrypt (hash: string, plainTextPassword: string) {
  return bcrypt.compare(plainTextPassword, hash)
}

export {
  encrypt,
  decrypt
}

