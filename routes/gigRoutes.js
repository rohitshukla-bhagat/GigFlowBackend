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
router.get('/:id', getGigById);
router.put('/:id', protect, require('../controllers/gigController').updateGig);
router.delete('/:id', protect, require('../controllers/gigController').deleteGig);

module.exports = router;
