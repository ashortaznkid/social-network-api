const router = require('express').Router();

const {
    getThought,
    getSingleThought,
    createthought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction,
    deleteAll,
} = require('../../controllers/thoughtController');

router.route('/').get(getThought).post(createthought).delete(deleteAll);

router.route('/:thoughtId')
.get(getSingleThought)
.put(updateThought)
.delete(deleteThought);

router.route('/:thoughtId/reactions')
.post(addReaction);

router.route('/:thoughtId/reactions/:reactionsId')
.delete(deleteReaction);

module.exports = router;