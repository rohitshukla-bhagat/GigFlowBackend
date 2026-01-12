const mongoose = require('mongoose');

const bidSchema = mongoose.Schema(
    {
        gigId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Gig',
        },
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'GigUser',
        },
        message: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'hired', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
