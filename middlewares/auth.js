import basicAuth from 'express-basic-auth';

export const authMiddleware = basicAuth({
  users: { [process.env.API_USER]: process.env.API_PASSWORD },
  challenge: true, 
  unauthorizedResponse: (req) => ({
    message: "Unauthorized: Invalid username or password"
  }),
});
