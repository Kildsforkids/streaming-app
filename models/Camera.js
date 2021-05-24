import mongoose from 'mongoose'
const {Schema, model, Types} = mongoose

const schema = new Schema({
    ip: {type: String, required: true, unique: true},
    status: {type: String, default: 'Неактивна'},
    classroom: {type: Types.ObjectId, ref: 'Classroom'}
})

export default model('Camera', schema)