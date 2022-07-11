const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.post('/all-blogs/:userid', authController.all_blogs_post);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/all-blogs', authController.all_blogs_get);
router.get('/my-blogs', authController.my_blogs_get);
router.get('/my-blogs/:id', authController.my_blogs_myblogid_get);

router.get('/all-blogs/:id', authController.all_blogs_id_get);
router.get('/all-blogs/del/:id', authController.all_blogs_del_id_get);
router.get('/about', authController.about_get);



module.exports = router;