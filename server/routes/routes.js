import express from 'express';
import cron from 'node-cron'
import { applications, getAllApplications } from '../Controllers/Applications.js';
const router = express.Router();

import { EmailVerify, getUser, login, requestApproval, SignUp, updateUserProfile } from '../Controllers/Auth.js';
import { AddBlog, getAllBlogs, removeBlog } from '../Controllers/Blogs.js';
import { AddComment, AddEvent, approveEvent, getAllEvents, getComment, removeComment, removeEvent } from '../Controllers/Events.js';
import { deleteJob, getAllJobs, getAllJobsForEmployee, getSingleJob, Jobs } from '../Controllers/Jobs.js';
import { approveUser, getAllUsers, removeUser, updateCompanyProfile } from '../Controllers/Profile.js';
import { Biditem, BidNotification, deleteSell, EditSellitem, getAllSell, getAllSells, getNotification, removeNotification, Sellitem } from '../Controllers/Sell.js';

router.get('/', (req, res) => {
  console.log('Cookies: ', req.cookies)
  res.send({
    success: '1',
    message: 'This is api working',
  });
});

cron.schedule('* * * * * *', () => {
  BidNotification()
});

//USER DETAILS
router.get('/getUser/:userId', getUser);
router.get('/getAllUsers', getAllUsers);
router.post('/requestApproval', requestApproval);
router.post('/updateUserProfile', updateUserProfile);

// LOGIN
router.post('/login', login);
router.post('/signup', SignUp);
router.post('/emailVerification', EmailVerify);
router.post('/removeUser', removeUser);
router.post('/approveUser', approveUser);

//SELL
router.post('/Sellitem', Sellitem);
router.get('/Sellitem/:userId', getAllSell);
router.post('/EditSellitem', EditSellitem);
router.post('/deleteSell', deleteSell);

//BUY
router.get('/getAllSells', getAllSells);
router.post('/Biditem', Biditem);

// NOTIFICATION
router.get('/getNotification/:userId', getNotification)
router.post('/removeNotification', removeNotification)


export default router;

























// import { authenticateToken } from '../Controllers/AuthenticateToken.js';
// import {getUser, updateUser} from "../Controllers/User.js";
// import { refreshToken } from '../Controllers/AuthenticateToken.js';
// router.post('/emailVerification', EmailVerify);
// router.post('/forgotPassword', ForgotPassword);
// router.post('/forgotPasswordChange',ForgotPasswordChange);
// router.post ("/user",authenticateToken,updateUser);
// router.get("/user",authenticateToken,getUser);
// AUTHENTICATION
// router.get("/isAuthorized",authenticateToken,isAuthorized);
// router.get("/refreshToken/:userId/:quizId",refreshToken);