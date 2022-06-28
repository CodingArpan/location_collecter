import app from './app.js';
import serverless from 'serverless-http';
export const index = serverless(app);