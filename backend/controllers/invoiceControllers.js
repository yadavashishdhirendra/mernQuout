const Invoice = require('../models/invoiceModel');
const cron = require('node-cron');
const sendEmail = require('../utils/SendEmail');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// ROUTE 1=> CREATE INVOICE
exports.createInvoice = async (req, res) => {
    try {
        const {
            pricebasis,
            delivery,
            warranty,
            payment,
            mtc,
            packaging,
            companyname,
            kindatt,
            offerno,
            revisionnumber,
            customerrefno,
            validity,
            projectname,
            products,
            terms,
            email,
            contact,
            status,
        } = req.body;
        const newdata = [{
            itemname: req.body,
            itemdesc: req.body,
            itemsize: req.body,
            itemuom: req.body,
            itemqty: req.body,
            itemprice: req.body,
            pricesign: req.body,
            first: req.body,
            second: req.body,
            third: req.body,
            fourth: req.body,
            fifth: req.body,
            percentagesign: req.body
        }]
        const termsData = [{
            title: req.body,
            userInput: req.body
        }]

        // if (!products.fifth) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Please fill all the required fields"
        //     })
        // }


        if (!companyname) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields"
            })
        }
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields"
            })
        }
        if (!contact) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields"
            })
        }
        if (!pricebasis || !delivery || !payment || !mtc || !packaging || !warranty) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields"
            })
        }
        const createInvoice = await Invoice.create({
            companylogo: {
                public_id: 'companylogo',
                url: 'https://www.ditechcdm.com/Images/Logo/DiTech%20Logo%20DM_Final%20(1).png',
            },
            pricebasis,
            delivery,
            warranty,
            payment,
            mtc,
            packaging,
            companyname,
            offerno,
            kindatt,
            revisionnumber,
            customerrefno,
            validity,
            projectname,
            products,
            terms,
            termsData,
            newdata,
            email,
            contact,
            status,
            owner: req.user.id
        });

        const user = await User.findById(req.user.id)
        user.invoices.push(createInvoice._id)
        await user.save()
        await createInvoice.save()
        res.status(201).json({
            success: true,
            createInvoice,
            message: "Invoice Created Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// ROUTE 2 => GET ALL INVOICE
exports.getAllInvoice = async (req, res) => {
    try {
        let Invoices;
        if (!req.body.month) {
            Invoices = await Invoice.find({}).sort('-createdAt');
        } else if (req.body.month == 'ALL') {
            Invoices = await Invoice.find({}).sort('-createdAt');
        } else {
            Invoices = await Invoice.find({
                "month": req.body.month
            }).sort('-createdAt');
        }
        var totalAmount = 0;
        Invoices.forEach(invoice => {
            invoice.products.forEach(prod => {
                totalAmount += prod.itemqty * prod.itemprice;
            });
        });
        res.status(200).json({
            success: true,
            Invoices,
            InvoiceCount: Invoices.length,
            totalAmount
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ROUTE 3 => GET SINGLE INVOICE DETAILS
exports.getSingleInvoice = async (req, res) => {
    try {
        const getInvoice = await Invoice.findById(req.params.id);
        if (!getInvoice) {
            return res.status(500).json({
                success: false,
                message: "Invoice not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Invoice Fetch Successfully",
            getInvoice
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ROUTE 4 => DELETE INVOICE
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        const userId = await User.findById(req.user.id)
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice doesn't Exist"
            })
        }
        // REMOVING INVOICE FROM USER INVOICES ARRAY ALSO
        if (userId.invoices.includes(invoice._id)) {
            const removeInvoice = userId.invoices.indexOf(invoice._id)
            userId.invoices.splice(removeInvoice, 1)
            await userId.save()
        }
        await invoice.remove();
        res.status(200).json({
            success: true.valueOf,
            message: "Invoice Deleted Success.",
            invoice
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ROUTE GET ALL DATA OF A PARTICLULAR ID
exports.getNewzelData = async (req, res) => {
    try {
        NewzelData = await User.find({
            '_id': {
                $in: [
                    mongoose.Types.ObjectId('6244154324be38ae01136933'),
                    mongoose.Types.ObjectId('62443c9d1ae0928e6d3f127f'),
                ]
            }
        }).populate("invoices").sort('-createdAt');
        res.status(200).json({
            success: true,
            NewzelData,
            InvoiceCount: NewzelData.length,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ROUTE 5 => UPDATE INVOICE
exports.updateInvoice = async (req, res) => {
    try {
        const updateData = {
            companyname: req.body.companyname,
            offerno: req.body.offerno,
            kindatt: req.body.kindatt,
            revisionnumber: req.body.revisionnumber,
            customerrefno: req.body.customerrefno,
            email: req.body.email,
            contact: req.body.contact,
            validity: req.body.validity,
            projectname: req.body.projectname,
            products: req.body.products,
            itemname: req.body.itemname,
            itemdesc: req.body.itemdesc,
            itemsize: req.body.itemsize,
            itemuom: req.body.itemuom,
            itemqty: req.body.itemqty,
            itemprice: req.body.itemprice,
            first: req.body.first,
            second: req.body.second,
            third: req.body.third,
            fourth: req.body.fourth,
            fifth: req.body.fifth,
            pricebasis: req.body.pricebasis,
            pricesign: req.body.pricesign,
            delivery: req.body.delivery,
            warranty: req.body.warranty,
            payment: req.body.payment,
            mtc: req.body.mtc,
            packaging: req.body.packaging,
            title: req.body.title,
            userInput: req.body.userInput,
            terms: req.body.terms,
            percentagesign: req.body.percentagesign
        }

        const Invoices = await Invoice.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: false,
            useFindAndModify: false
        });
        res.status(200).json({
            success: true,
            Invoices
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// exports.filterMoth = async (req, res) => {
//     try {
//         const filterData = await Invoice.find({
//             "month": req.body.month
//         })

//         res.status(200).json({
//             success: true,
//             filterData
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }


// const job = schedule.scheduleJob('0 0 0 1 */1 *', function () {
//     console.log('heeeeey')
// });

// cron.schedule('* * * * * *', () => {
// console.log('Running Task in every min.');
// });


// ROUTE 6 => SEND AN EMAIL WITH INVOICE DATA
// cron.schedule('* * * * * *', async () => {
//     try {
//         const today = new Date()
//         const currentMonthData = today.toLocaleString('default', {
//             month: 'long'
//         })
//         const Invoices = await Invoice.find({
//             "month": {
//                 currentMonthData
//             }
//         }).sort('-createdAt');
//         var totalAmount = 0;
//         Invoices.forEach(invoice => {
//             invoice.products.forEach(prod => {
//                 totalAmount += prod.itemqty * prod.itemprice;
//             });

//         });
//         res.status(200).json({
//             success: true,
//             Invoices,
//             InvoiceCount: Invoices.length,
//             totalAmount
//         })
//         const message = `Total Amount of Invoice Created - ${totalAmount}`
//         try {
//             await sendEmail({
//                 email: "yadavashishdhirendra@gmail.com",
//                 subject: "Monthly Invoice Review",
//                 message
//             })
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: error.message
//             })
//         }
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// })

// ROUTE 7 => GET LOGGED IN USER QUOTATION
exports.loggedUserQuotation = async (req, res) => {
    try {
        let Invoices;
        if (!req.body.month) {
            Invoices = await Invoice.find({
                owner: req.user.id
            }).sort('-createdAt');
        } else if (req.body.month == 'ALL') {
            Invoices = await Invoice.find({
                owner: req.user.id
            }).sort('-createdAt');
        } else {
            Invoices = await Invoice.find({
                owner: req.user.id,
                "month": req.body.month
            }).sort('-createdAt');
        }
        var totalAmount = 0;
        Invoices.forEach(invoice => {
            invoice.products.forEach(prod => {
                totalAmount += prod.itemqty * prod.itemprice;
            });

        });
        res.status(200).json({
            success: true,
            Invoices,
            InvoiceCount: Invoices.length,
            totalAmount
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ROUTE 8 => UPDATE INVOICE STATUS
exports.updateOrderStatus = async (req, res) => {
    try {
        const InvoiceStatus = await Invoice.findById(req.params.id);
        if (!InvoiceStatus) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found with this id!"
            })
        }
        if (InvoiceStatus.status === "Delivered") {
            return res.status(404).json({
                success: false,
                message: "You have already Delivered This Project!"
            })
        }
        InvoiceStatus.status = req.body.status;
        if (req.body.status === "Delivered") {
            InvoiceStatus.deliveredAt = Date.now()
        }

        await InvoiceStatus.save({
            validateBeforeSave: false
        })

        res.status(200).json({
            success: true,
            InvoiceStatus,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}