const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const partnerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
            required: true
        },
        featured: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            requried: true
        }
    },
    {timestamps: true}
)

const Partner = model('Partner', partnerSchema);

module.exports = Partner;