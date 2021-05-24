import mongoose from 'mongoose'
const {Schema, model, Types} = mongoose

const schema = new Schema({
    name: {type: String, required: true, unique: true}
})

export default model('Classroom', schema)