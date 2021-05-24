import mongoose from 'mongoose'
const {Schema, model, Types} = mongoose

const schema = new Schema({
    name: {type: String, required: true},
    link: {type: String},
    start: {type: Date, default: Date.now},
    end: {type: Date, default: Date.now},
    status: {type: String, default: 'Не задана'},
    camera: {type: Types.ObjectId, ref: 'Camera'}
})

export default model('Stream', schema)