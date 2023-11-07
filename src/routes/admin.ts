import express from 'express';
const adminRouter = express.Router();

import {register, login} from '../controllers/admin/auth'

adminRouter.post('/register', register)
adminRouter.post('/login', login)

export default adminRouter;