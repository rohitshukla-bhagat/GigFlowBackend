const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const mongoose = require('mongoose');

const placeBid = async (req, res) => {
    const { gigId, message, price } = req.body;

    try {
        const bid = await Bid.create({
            gigId,
            freelancerId: req.user._id,
            message,
            price,
        });

        res.status(201).json(bid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getBidsForGig = async (req, res) => {
    try {
        const bids = await Bid.find({ gigId: req.params.gigId }).populate(
            'freelancerId',
            'name email'
        );
        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const hireFreelancer = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const bid = await Bid.findById(req.params.bidId).session(session);

        if (!bid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Bid not found' });
        }

        const gig = await Gig.findById(bid.gigId).session(session);

        if (!gig) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Gig not found' });
        }

        if (gig.status !== 'open') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Gig is not open' });
        }

        // 3. Update selected bid status = "hired"
        bid.status = 'hired';
        await bid.save({ session });

        // 4. Update gig status = "assigned"
        gig.status = 'assigned';
        await gig.save({ session });

        // 5. Update all other bids of same gig = "rejected"
        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bid._id } },
            { status: 'rejected' }
        ).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Freelancer hired successfully' });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my bids (logged-in freelancer)
// @route   GET /api/bids/my-bids
// @access  Private (Freelancer)
const getMyBids = async (req, res) => {
    try {
        const bids = await Bid.find({ freelancerId: req.user._id })
            .populate('gigId', 'title description budget status')
            .sort({ createdAt: -1 });
        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    placeBid,
    getBidsForGig,
    hireFreelancer,
    getMyBids,
};
