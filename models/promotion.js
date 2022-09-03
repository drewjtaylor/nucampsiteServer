const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema(
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
        cost: {
            type: Currency,
            required: true,
            min: 0
        },
        description: {
            type: String,
            requried: true
        },
    },
    {timestamps: true}
)

const Promotion = model('Promotion', promotionSchema);

module.exports = Promotion;