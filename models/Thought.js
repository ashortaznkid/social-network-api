const { Schema, model, Types } = require('mongoose');

const reactionSchema = new Schema (
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        
        reactionBody: {
                type: String,
                required: true,
                maxlength: 280,
        },

        username: {
            type: String,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
            //get: createdAtVal
        }
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
)


const thoughtSchema = new Schema (
    {
        thoughtText: {
            type: String,
            required: true,
            minlenght: 1,
            maxlenght: 280,
        },

        createdAt: {
            type: Date,
            default: Date.now,
            //get: createdAtVal 
        },

        username: {
            type: String,
            required: true,
        },

        reaction: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
)


thoughtSchema.virtuals('reactionCount').get(function() {
    return this.reactions.length;
})

const Thought = model('Thought', thoughtSchema);
module.exports = Thought;