const { User, Thought } = require('../models');

module.exports = {
    //get all
    async getUser(req, res) {
       try {
        const users = await User.find();
        res.json(users);
       } catch (err) {
        res.status(500).json(err);
       }
    },
    //get single
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({_id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .populate('friends')

            if (!user) {
                return res.status(404).json({ message: 'No user with that id!' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //post new
    async createUser(req, res) {
        try {
            const user = await User.crerate(req.body);
            res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    //put/update
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user with this id!' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //delete 
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'No user with this id' });
            }

            await User.deleteMany({ _id: { $in: user.thoughts }});
            res.json({ message: 'User and thoughts deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //post friend
    async createFriend(req, res) {
      try {
        const friend = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )

        if (!friend) {
            return res.status(404).json({ message: 'No user found with this id' });
        }

        res.json(friend);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    //delete friend
    async deleteFriend(req, res) {
        try{
            const friend = await User.findByIdAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            )

            if (!friend) {
                return res.status(404).json({ message: 'No user found with this id' });
            }

            res.json(friend)
        } catch (err) {
            res.status(500).json(err);
        }
    }
}