import * as jwt from 'jsonwebtoken';

export async function jwtSign(
  payload: Record<any, any>,
  secret: string,
  options: jwt.SignOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { ...options }, (err, encoded) => {
      if (err) {
        reject(err);
      }

      return resolve(encoded);
    });
  });
}

export async function jwtVerify(
  token: string,
  secret: string,
  options?: jwt.VerifyOptions,
): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err: Error, decoded) => {
      if (err) {
        reject(err);
      }

      resolve(decoded);
    });
  });
}
