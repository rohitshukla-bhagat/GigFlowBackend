const express = require('express');
const router = express.Router();
const {
    getAllGigs,
    createGig,
    getGigById,
    getMyGigs,
    getMyStats,
} = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllGigs);
router.get('/my-gigs', protect, getMyGigs);
router.get('/my-stats', protect, getMyStats);
router.post('/', protect, createGig);
router.get('/:id', getGigById); // ID route must be last to avoid conflict with /my-gigs if ID is not validated as ObjectId regex immediately, though express routes match in order. Better to put specific routes before params.

module.exports = router;
