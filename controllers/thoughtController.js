const { User, Thought } = require('../models');
const { db } = require('../models/User');

module.exports = {
    //get all
    async getThought(req, res) {
        try {
            const dbthought = await Thought.find();
            res.json(dbthought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //get one
    async getSingleThought(req, res) {
        try {
            const dbthought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v')

            if (!dbthought) {
                res.status(404).json({ message: 'No Thought found with this id' });
            }
            res.json(dbthought)
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //post 
    async createthought(req, res) {
        try {
            const dbthought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(

                { username: req.body.username },
                // {$push: { thoughts: dbthought._id}},
                { $addToSet: { thoughts: dbthought._id } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'Thought created but no user found with this username' });
            }
            console.log(dbthought);
            res.json(dbthought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
            
        }
    },
    //update/put
    async updateThought(req, res) {
        try {
            const dbthought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!dbthought) {
                return res.status(404).json({ message: 'No Thought found with this Id' });
            }
            res.json(dbthought)
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //delete
    async deleteThought(req, res) {
        try {
            const dbthought = await Thought.findOneAndDelete(
                { _id: req.params.thoughtId }
            );

            if (!dbthought) {
                return res.status(404).json({ message: 'No Thought with this Id' });
            }

            const user = await User.findOneAndUpdate(
                { dbthought: req.params.thoughtId },
                { $pull: { dbthought: req.params.thoughtId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'Thought deleted but no user found with this Id' });
            }
            res.json({ message: 'Thought deleted' })
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //post reaction
    async addReaction({ params, body }, res) {
        try {
            const dbthought = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $addToSet: { reactions: body } },
                { runValidators: true, new: true }
            );

            if (!dbthought) {
                return res.status(404).json({ message: 'No Thought found with this Id' });
            }
            res.json(dbthought)
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //delete reaction
    async deleteReaction({ params }, res) {
        try {
            const dbthought = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $pull: { reactions: { reactionId: params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!dbthought) {
                return res.status(404).json({ message: 'No Thought found with this Is' });
            }
            res.json({ message: 'Reaction deleted' })
        } catch (err) {
            res.status(500).json(err);
        }
    },
};