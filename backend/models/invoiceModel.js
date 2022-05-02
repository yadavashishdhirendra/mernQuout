const mongoose = require('mongoose');

const today = new Date()

const invoiceSchema = new mongoose.Schema({
    companyname: {
        type: String,
        required: true,
    },
    offerno: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
        index: {
            unique: true
        }
    },
    kindatt: {
        type: String,
    },
    companylogo: {
        public_id: String,
        url: String,
    },
    revisionnumber: {
        type: Number,
    },
    customerrefno: {
        type: String
    },
    products: [
        {
            itemname: String,
            itemdesc: String,
            itemsize: String,
            itemuom: String,
            itemqty: Number,
            itemprice: Number,
            pricesign: String,
            first: Number,
            second: Number,
            third: Number,
            fourth: Number,
            fifth: Number,
            percentagesign: String,
        }
    ],
    terms: [{
        title: String,
        userInput: String
    }],
    email: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    validity: {
        type: String
    },
    projectname: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    pricebasis: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        required: true
    },
    delivery: {
        type: String,
        required: true
    },
    mtc: {
        type: String,
        required: true
    },
    warranty: {
        type: String,
        required: true
    },
    packaging: {
        type: String,
        required: true
    },
    month: {
        type: String,
        default: today.toLocaleString('default', {
            month: 'long'
        })
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        default: "InProgress"
    },
    deliveredAt: {
        type: Date,
    }
})

module.exports = mongoose.model("Invoice", invoiceSchema)