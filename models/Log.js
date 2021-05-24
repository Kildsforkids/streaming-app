import mongoose from 'mongoose'
const {Schema, model, Types} = mongoose

const schema = new Schema({
    actionType: {type: String, required: true},
    description: {type: String},
    user: {type: Types.ObjectId, ref: 'User'}
})

export default model('Log', schema)