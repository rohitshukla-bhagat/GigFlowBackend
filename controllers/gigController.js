const Gig = require('../models/Gig');
const Bid = require('../models/Bid');
const mongoose = require('mongoose');

// @desc    Get all open gigs
// @route   GET /api/gigs
// @access  Public
const getAllGigs = async (req, res) => {
    try {
        // Basic search functionality can be added here using regex on title
        const gigs = await Gig.find({ status: 'open' }).populate('ownerId', 'name email');
        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res) => {
    const { title, description, budget } = req.body;

    try {
        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id,
        });

        res.status(201).json(gig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single gig by ID
// @route   GET /api/gigs/:id
// @access  Public (or Private depending on needs, Guide implies used by details page)
const getGigById = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

        if (gig) {
            res.status(200).json(gig);
        } else {
            res.status(404).json({ message: 'Gig not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's gigs
// @route   GET /api/gigs/my-gigs
// @access  Private
const getMyGigs = async (req, res) => {
    try {
        const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's gig stats
// @route   GET /api/gigs/my-stats
// @access  Private
const getMyStats = async (req, res) => {
    try {
        const totalJobs = await Gig.countDocuments({ ownerId: req.user._id });
        const openJobs = await Gig.countDocuments({ ownerId: req.user._id, status: 'open' });
        const assignedJobs = await Gig.countDocuments({ ownerId: req.user._id, status: 'assigned' });

        res.status(200).json({
            totalJobs,
            openJobs,
            assignedJobs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Update a gig
// @route   PUT /api/gigs/:id
// @access  Private
const updateGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        // Check for user ownership
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedGig = await Gig.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedGig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a gig
// @route   DELETE /api/gigs/:id
// @access  Private
const deleteGig = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const gig = await Gig.findById(req.params.id).session(session);

        if (!gig) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Gig not found' });
        }

        // Check for user ownership
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Delete all bids associated with this gig
        await Bid.deleteMany({ gigId: gig._id }).session(session);

        // Delete the gig
        await Gig.deleteOne({ _id: gig._id }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ id: req.params.id, message: 'Gig deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllGigs,
    createGig,
    getGigById,
    getMyGigs,
    getMyStats,
    updateGig,
    deleteGig,
};