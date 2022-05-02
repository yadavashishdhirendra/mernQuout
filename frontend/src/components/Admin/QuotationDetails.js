import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getSingleInvoice } from '../../actions/Invoiceaction';
import Loader from '../Loader/Loader';
import MetaData from '../MetaData';
import RightIcon from '@material-ui/icons/ChevronRight'
import { Link } from 'react-router-dom';
import '../InvoiceDetails.css'
import ReactToPrint from 'react-to-print';
import { Button } from '@material-ui/core';
import NewzelHeader from '../Logo/Newzel-Header.jpg'
import NewzelFooter from '../Logo/footer.jpg';
var converter = require('number-to-words');

const QuotationDetails = ({ match }) => {
    const dispatch = useDispatch();
    const { error, loading, getInvoice } = useSelector((state) => state.InvoiceDetails);
    const { user } = useSelector((state) => state.singleUserDetails)

    const componentRef = useRef();

    let itemprice = 0;
    getInvoice.products && getInvoice.products.map(invoice => {
        itemprice = invoice.first + invoice.second + invoice.third + invoice.fourth + invoice.fifth;
        invoice['itemprice'] = itemprice
    })

    let grandTotal = 0;
    getInvoice.products && getInvoice.products.forEach((items) => {
        return (
            grandTotal += items.itemqty * items.itemprice
        )
    })

    let sign;
    getInvoice.products && getInvoice.products.map((items) => {
        return (
            sign = items.pricesign
        )
    })

    const userId = user._id

    const dateFormat = getInvoice.createdAt;

    const result = converter.toWords(grandTotal)

    console.log(grandTotal);
    useEffect(() => {
        if (error) {
            dispatch(clearErrors())
        }
        dispatch(getSingleInvoice(match.params.id))
    }, [dispatch, match.params.id, error])

    return (
        <div className="container invoice-detailer">
            <Fragment>
                <div className='breadcrumb'>
                    <p><Link to={`/admin/getsingleuser/${userId}`}>User Details</Link> <span><RightIcon /></span> <span>Quotation Details</span></p>
                </div>
                {
                    loading ? <Loader /> :
                        <Fragment>
                            <MetaData title={`${getInvoice.companyname}'s Quotation Details`} />
                            <ReactToPrint trigger={() => <Button className='mt-5 print-button'>Print</Button>} content={() => componentRef.current} />
                            <div className='invoice-products' ref={componentRef}>
                                <img src={NewzelHeader} className="Newzel-Header" alt="" />
                                <div className='scroll-mob'>
                                    <table width='100%'>
                                        <tbody>
                                            <tr className='equal-width'>
                                                <td valign='top'>
                                                    <div>
                                                        <p><span><b>Company Name:</b></span> <span>{getInvoice.companyname}</span></p>
                                                    </div>
                                                    <div>
                                                        <p><span><b>Client Name:</b></span> <span>{getInvoice.kindatt}</span></p>
                                                    </div>
                                                    <div>
                                                        <p><span><b>Email:</b></span> <span>{getInvoice.email}</span></p>
                                                    </div>
                                                    <div>
                                                        <p className='mb-0'> <span><b>Contact:</b></span> <span>{getInvoice.contact}</span></p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <p><span><b>OFFER NO:</b></span> <span>{getInvoice.offerno}</span></p>
                                                    </div>
                                                    <div>
                                                        <p><span><b>CUSTOMER REF:</b></span> <span>{getInvoice.customerrefno}</span></p>
                                                    </div>
                                                    <div>
                                                        <p><span><b>DATE:</b></span> <span>{String(getInvoice.createdAt).substr(0, 10)}</span></p>
                                                    </div>
                                                    <div>
                                                        <p><span><b>VALIDITY:</b></span> <span>{String(getInvoice.validity).substr(0, 10)}</span></p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table width="100%" class="bg-gray">
                                        <thead>
                                            <tr>
                                                <th><span>Item</span></th>
                                                <th><span>Description</span></th>
                                                <th><span>Size</span></th>
                                                <th><span>UOM</span></th>
                                                <th><span>Qty</span></th>
                                                <th><span>Price</span></th>
                                                <th><span>Total</span></th>
                                            </tr>
                                        </thead>
                                        {getInvoice.products && getInvoice.products.map((items) => {
                                            return (
                                                <tbody key={items._id}>
                                                    <tr>
                                                        <td>{items.itemname}</td>
                                                        <td>{items.itemdesc}</td>
                                                        <td>{items.itemsize}</td>
                                                        <td>{items.itemuom}</td>
                                                        <td>{items.itemqty}</td>
                                                        <td>{items.pricesign === '₹' ? '₹' : '＄'}{items.itemprice.toFixed(2)}</td>
                                                        <td>{items.pricesign === '₹' ? '₹' : '＄'}{(items.itemqty * items.itemprice).toFixed(2)}</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })}
                                    </table>
                                </div>
                                <table width='100%' className='table-words'>
                                    <tbody>
                                        <tr>
                                            <td><span className='word-head'>TOTAL IN WORDS :</span> &nbsp;<span className='text-uppercase'>{result} {sign === '₹' ? 'Rupees' : 'Dollar'} only</span></td>
                                            <td><span><span className='grand-words'>TOTAL= </span>{sign === '₹' ? '₹' : '＄'}{grandTotal.toFixed(2)}</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table width='100%'>
                                    <tbody>
                                        <tr className='terms-conditions'>
                                            <td>
                                                <div className='head-inner-text'>
                                                    <p><span><b>Terms & Conditions</b></span></p>
                                                </div>
                                                <div>
                                                    <p><b>Price Basis</b></p>
                                                </div>
                                                <div>
                                                    <p><b>Payment</b></p>
                                                </div>
                                                <div>
                                                    <p><b>Delivery</b></p>
                                                </div>
                                                <div>
                                                    <p><b>MTC</b></p>
                                                </div>
                                                <div>
                                                    <p><b>Warranty</b></p>
                                                </div>
                                                <div>
                                                    <p><b>Packaging</b></p>
                                                </div>
                                            </td>
                                            <td className='data-tc'>
                                                <div>
                                                    <p>:&nbsp;{getInvoice.pricebasis ? getInvoice.pricebasis : "-"}</p>
                                                </div>
                                                <div>
                                                    <p>:&nbsp;{getInvoice.payment ? getInvoice.payment : "-"}</p>
                                                </div>
                                                <div>
                                                    <p>:&nbsp;{getInvoice.delivery ? getInvoice.delivery : "-"}</p>
                                                </div>
                                                <div>
                                                    <p>:&nbsp;{getInvoice.mtc ? getInvoice.mtc : "-"}</p>
                                                </div>
                                                <div>
                                                    <p>:&nbsp;{getInvoice.warranty ? getInvoice.warranty : "-"}</p>
                                                </div>
                                                <div>
                                                    <p>:&nbsp;{getInvoice.packaging ? getInvoice.packaging : "-"}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table width='100%' className='bottom-part'>
                                    <tbody>
                                        <tr className='bottom-struct'>
                                            <td>
                                                <div>
                                                    <p className='mb-0 text-center'><b>For any queries, reach out via email on info@newzelindustries.com, call on +91 96536 47754</b></p>
                                                </div>
                                            </td>
                                        </tr>
                                        <img className='newzel-footer' src={NewzelFooter} alt="Newzelfooter" />
                                    </tbody>
                                </table>
                            </div>
                        </Fragment>
                }
            </Fragment>
        </div>
    )
}

export default QuotationDetails