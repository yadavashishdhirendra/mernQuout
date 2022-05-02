import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getSingleInvoice, updateInvoiceStatus } from '../actions/Invoiceaction';
import Loader from './Loader/Loader';
import MetaData from './MetaData';
import RightIcon from '@material-ui/icons/ChevronRight'
import { Link } from 'react-router-dom';
import './InvoiceDetails.css'
import ReactToPrint from 'react-to-print';
import { Button } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import NewzelHeader from './Logo/Newzel-Header.jpg'
import NewzelFooter from './Logo/footer.jpg'
import { useAlert } from 'react-alert';
import CheckGif from './Logo/check.gif'
import { UPDATE_STATUS_RESET } from '../constants/InvoiceConstants';
var converter = require('number-to-words');

const InvoiceDetails = ({ match, history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { error, loading, getInvoice } = useSelector((state) => state.InvoiceDetails);
    const { error: StatusError, isUpdated } = useSelector((state) => state.deleteInvoice);

    const [status, setStatus] = useState("");

    const componentRef = useRef();

    var validity = new Date(getInvoice.validity);
    var date = validity.getDate();
    var month = validity.getMonth() + 1;
    var year = validity.getFullYear();
    var InvoiceValidity = date + "/" + month + "/" + year;

    var CurrentDate = new Date(getInvoice.createdAt);
    var cDate = CurrentDate.getDate();
    var cMonth = CurrentDate.getMonth() + 1;
    var cYear = CurrentDate.getFullYear();
    var InvoiceCreatedAt = cDate + "/" + cMonth + "/" + cYear;

    let itemprice = 0;
    getInvoice.products && getInvoice.products.forEach(invoice => {
        itemprice = invoice.first + invoice.second + invoice.third + invoice.fourth + invoice.fifth;
        invoice['itemprice'] = itemprice
    })

    let marginAmount = 0;
    getInvoice.products && getInvoice.products.forEach(marAmt => {
        marginAmount = marAmt.first * marAmt.fifth / 100 + marAmt.first;
        marAmt['marginAmount'] = marginAmount;
    })

    let grandTotal = 0;
    getInvoice.products && getInvoice.products.forEach((items) => {
        return (
            grandTotal += items.itemqty * items.itemprice
        )
    })

    let marginPrice = 0;
    getInvoice.products && getInvoice.products.forEach((mtAmt) => {
        return (
            marginPrice += mtAmt.itemqty * mtAmt.marginAmount
        )
    })

    let percentSign;
    getInvoice.products && getInvoice.products.forEach((sign) => {
        return (
            percentSign = sign.percentagesign
        )
    })

    console.log(percentSign)

    let sign;
    getInvoice.products && getInvoice.products.map((items) => {
        return (
            sign = items.pricesign
        )
    })

    const InvoiceId = match.params.id;

    const processStatus = (e) => {
        e.preventDefault()
        dispatch(updateInvoiceStatus(InvoiceId, status))
        alert.success("Status Updated");
        // history.push('/invoice-list')
    }

    // const dateFormat = getInvoice.createdAt;

    const result = converter.toWords(grandTotal);

    const mtResult = converter.toWords(marginPrice);

    console.log(grandTotal);
    useEffect(() => {
        if (error) {
            dispatch(clearErrors())
        }
        if (StatusError) {
            alert.error(StatusError);
            dispatch(clearErrors())
        }
        if (isUpdated) {
            dispatch({
                type: UPDATE_STATUS_RESET
            })
        }
        dispatch(getSingleInvoice(match.params.id))
    }, [dispatch, match.params.id, error, StatusError, alert, history, isUpdated])

    return (
        <div className="container invoice-detailer">
            <Fragment>
                <div className='breadcrumb'>
                    <p><Link to='/invoice-list'>Quotation List</Link> <span><RightIcon /></span> <span>Quotation Details</span></p>
                </div>
                {
                    loading ? <Loader /> :
                        <Fragment>
                            <div className='count-Invoice'>
                                <div>
                                    {getInvoice.revisionnumber}
                                </div>
                            </div>
                            <MetaData title={`${getInvoice.companyname}'s Quotation Details`} />
                            <ReactToPrint trigger={() => <Tooltip title="Print Page" placement="top" arrow><Button className='mt-5 print-button'>Print</Button></Tooltip>} content={() => componentRef.current} />
                            {
                                getInvoice.status !== "Delivered" ? <form className='status-update' onSubmit={processStatus}>
                                    <p className='current-status'><b>Current Status:-</b> {getInvoice.status}</p>
                                    <select className='status' name="status" id="status" value={status} onChange={(e) => setStatus(e.target.value)} required>
                                        <option value="InProgress">Choose Status</option>
                                        <option value="Send For Approval">Send For Approval</option>
                                        <option value="Delivered">Delivered</option>

                                    </select> <br />
                                    <Button type='submit' disabled={!status ? true : false} className='process-Btn'>Process</Button>
                                </form> :
                                    <div className='deliveredAt'>
                                        <p className='delivered-status'><span style={{ verticalAlign: "middle" }}>Already Delivered!</span>&nbsp;<img style={{ width: "50px" }} src={CheckGif} alt="" /></p>
                                        <span>{new Date(getInvoice.deliveredAt).toLocaleString()}</span>
                                    </div>
                            }
                            <div className='invoice-products' ref={componentRef}>
                                <img src={NewzelHeader} className="Newzel-Header" alt="" />
                                <div className='scroll-mob'>
                                    <table width='100%'>
                                        <tbody>
                                            <tr className='equal-width'>
                                                <td valign='top' className='gray'>
                                                    <div>
                                                        <h4>Customer Details</h4>
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
                                                    </div>
                                                </td>
                                                <td className='gray'>
                                                    <div>
                                                        <h4>Offer Details</h4>
                                                        <div>
                                                            <p><span><b>OFFER NO:</b></span> <span>{getInvoice.offerno}</span></p>
                                                        </div>
                                                        <div>
                                                            <p><span><b>CUSTOMER REF:</b></span> <span>{getInvoice.customerrefno}</span></p>
                                                        </div>
                                                        <div>
                                                            <p><span><b>DATE:</b></span> <span>{InvoiceCreatedAt}</span></p>
                                                        </div>
                                                        <div>
                                                            <p><span><b>VALIDITY:</b></span> <span>{InvoiceValidity}</span></p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table width="100%" className='bg-gray'>
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
                                                        <td>{items.pricesign === '₹' ? '₹' : '＄'}{items.percentagesign === '%' ? (items.marginAmount).toFixed(2) : (items.itemprice).toFixed(2)}</td>
                                                        <td>{items.pricesign === '₹' ? '₹' : '＄'}{items.percentagesign === '%' ? (items.itemqty * items.marginAmount).toFixed(2) : (items.itemqty * items.itemprice).toFixed(2)}</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })}
                                    </table>
                                </div>
                                <table width='100%' className='table-words'>
                                    <tbody>
                                        <tr>
                                            <td><span className='word-head'>TOTAL IN WORDS :</span> &nbsp;<span className='text-uppercase'>{percentSign ? mtResult : result} {sign === '₹' ? 'Rupees' : 'Dollar'} only</span></td>
                                            <td><span><span className='grand-words'>Total= </span>{sign === '₹' ? '₹' : '＄'}{percentSign ? marginPrice.toFixed(2) : grandTotal.toFixed(2)}</span></td>
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
                                                <div className='packaging'>
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
                                {/* Extra Field Terms & condition */}
                                {
                                    getInvoice.terms && getInvoice.terms.map((tData) => {
                                        return (
                                            <table width='100%' className='extra-fields-table'>
                                                <tbody>
                                                    <tr className='terms-conditions extra-terms'>
                                                        <td>
                                                            <div>
                                                                <p><b>{tData.title}</b></p>
                                                            </div>
                                                        </td>
                                                        <td className='data-tc'>
                                                            <div>
                                                                <p className='mt-0'> {tData.userInput.length >= 1 ? ":" : ""}&nbsp;{tData.userInput}</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )
                                    })
                                }
                                {/* Extra Field Terms & conditions */}
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
        </div >
    )
}

export default InvoiceDetails