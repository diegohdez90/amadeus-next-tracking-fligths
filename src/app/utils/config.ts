import dotenv from 'dotenv';

dotenv.config()

const API_KEY=process.env.API_KEY
const API_SECRET=process.env.API_SECRET
export {
  API_KEY,
  API_SECRET,
};

