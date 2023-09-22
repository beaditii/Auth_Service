const express=require('express');

 const UserController = require('../../controllers/user-controllers');
 const {AuthRequestValidators} = require('../../middlewares/index');

const router=express.Router();

router.post(
    '/signup',
     AuthRequestValidators.validateUserAuth,
    UserController.create
);
router.post('/signIn',
AuthRequestValidators.validateUserAuth,
UserController.signIn);

router.get(
    '/isAuthenticated',
    UserController.isAuthenticated
)

module.exports = router;