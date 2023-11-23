const express = require('express');
const router = express.Router();
const vendors = require('../controllers/vendors');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Vendor = require('../models/vendor');
const { isLoggedIn, isAuthor, validateVendor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(vendors.index))
    .post(isLoggedIn, upload.array('image'), validateVendor, catchAsync(vendors.createVendor))

router.get('/new', isLoggedIn, vendors.newVendor)

router.route('/:id')
    .get(catchAsync(vendors.showVendor))
    .patch(isLoggedIn, isAuthor, upload.array('image'), validateVendor, catchAsync(vendors.updateVendor))
    .delete(isLoggedIn, isAuthor, catchAsync(vendors.deleteVendor))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(vendors.editVendor))

module.exports = router;