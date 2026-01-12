const express = require('express');
const router = express.Router();
const {
    placeBid,
    getBidsForGig,
    hireFreelancer,
    getMyBids,
} = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-bids', protect, getMyBids);
router.post('/', protect, placeBid);
router.get('/:gigId', protect, getBidsForGig);
router.patch('/:bidId/hire', protect, hireFreelancer);

module.exports = router;
