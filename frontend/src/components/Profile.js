import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ToolTip from '@material-ui/core/Tooltip'
import MetaData from './MetaData'
import './profile.css'
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Loader from './Loader/Loader';
import { clearErrors, getLoggedInvoice } from '../actions/Invoiceaction';
import EditIcon from '@material-ui/icons/Edit';
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Profile = () => {
    const dispatch = useDispatch();
    const { error, loading, user } = useSelector((state) => state.auth)
    const { error: invoiceError, Invoices } = useSelector((state) => state.loggedInvoice);


    // Invoices.forEach(invoice => {
    //     var totalAmount = 0;
    //     invoice.products.forEach(prod => {
    //         totalAmount += prod.itemqty * prod.itemprice;
    //     });
    //     invoice['totalAmount'] = totalAmount;
    // });
    // console.log(Invoices);

    let marginAmount = 0;
    Invoices && Invoices.forEach(sign => {
        sign.products.forEach(mtAmount => {
            if (mtAmount.percentagesign === '%') {
                marginAmount = mtAmount.first * mtAmount.fifth / 100 + mtAmount.first;
                mtAmount['marginAmt'] = marginAmount;
            }
        })
    })

    let itemprice = 0;
    Invoices && Invoices.forEach(invoice => {
        invoice.products.forEach(prod => {
            if (prod.percentagesign !== '%') {
                itemprice = prod.first + prod.second + prod.third + prod.fourth + prod.fifth;
                prod['itemprice'] = itemprice
            }
        })
    })

    let marginRupees = 0;
    Invoices && Invoices.forEach(rupee => {
        rupee.products.forEach(rup => {
            if (rup.percentagesign === '%' && rup.pricesign === '₹') {
                marginRupees += rup.marginAmt * rup.itemqty
            }
        })
    })
    // console.log(marginRupees);

    let marginDollar = 0;
    Invoices && Invoices.forEach(dollar => {
        dollar.products.forEach(doll => {
            if (doll.percentagesign === '%' && doll.pricesign === '＄') {
                marginDollar += doll.marginAmt * doll.itemqty
            }
        })
    })

    // console.log(marginDollar);

    var totalAmount = 0;
    var dollartotalAmt = 0;
    Invoices.forEach(invoice => {
        invoice.products.forEach(prod => {
            if (prod.pricesign === '₹' && prod.percentagesign !== '%') {
                totalAmount += prod.itemqty * prod.itemprice;
            }
            else if (prod.pricesign === '＄' && prod.percentagesign !== '%') {
                dollartotalAmt += prod.itemqty * prod.itemprice;
            }
        });
    });

    console.log(totalAmount)

    var RupeeAmount = marginRupees + totalAmount;
    console.log(RupeeAmount)

    var DollarsAmount = marginDollar + dollartotalAmt;
    console.log(DollarsAmount)



    const lineState = {
        labels: ["Initial Amount", "Total Amount of Quotation Created In Rupees"],
        datasets: [
            {
                label: "TOTAL AMOUNT OF Quotation CREATED IN RUPEES",
                backgroundColor: ["#423F8D"],
                hoverBackgroundColor: ["rgb(197, 72, 49)"],
                data: [0, RupeeAmount],
            },
        ],
    };

    const lineStates = {
        labels: ["Initial Amount", "Total Amount of Quotation Created In Dollar"],
        datasets: [
            {
                label: "TOTAL AMOUNT OF Quotation CREATED IN DOLLAR",
                backgroundColor: ["#D7D7D7"],
                hoverBackgroundColor: ["rgb(197, 72, 49)"],
                data: [0, DollarsAmount],
            },
        ],
    };



    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (invoiceError) {
            alert.error(invoiceError)
            dispatch(clearErrors())
        }
        dispatch(getLoggedInvoice())
    }, [dispatch, error, invoiceError])

    return (
        <Fragment>
            <div className="container profile-wrapper">
                {
                    loading ? <Loader /> :
                        <Fragment>
                            <MetaData title={`${user.name}'s - Profile `} />
                            <div className='grid-sm-profile'>
                                <div>
                                    <div>
                                        <img src={user.avatar && user.avatar.url} alt="" />
                                    </div>
                                    <ToolTip placement="top" title="Update Avatar" arrow><Link to='/updateavatar'><Button className='edit-profile'><EditIcon /></Button></Link></ToolTip> <br />
                                    <Link className='link' to='/password-update'><Button className='change-password'>Change Password</Button></Link>
                                </div>
                                <div>
                                    <div>
                                        <p className='label'>Name :</p>
                                        <p className='label-data'>{user.name}</p>
                                    </div>
                                    <div>
                                        <p className='label'>Company Name :</p>
                                        <p className='label-data'>{user.companyname}</p>
                                    </div>
                                    <div>
                                        <p className='label'>Email :</p>
                                        <p className='label-data'>{user.email}</p>
                                    </div>
                                    <div>
                                        <p className='label'>Joined On :</p>
                                        <p className='label-data'>{String(user.created_At).substr(0, 10)}</p>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                }
            </div>
            <div className='amount-panel-bg'>
                <div className='amount-panel'>
                    <div>
                        <p>Total Quotation Created</p>
                        <p className='relative-live'><span className='ripples'></span><span> {Invoices.length && Invoices.length}</span></p>
                    </div>
                    <div>
                        <p>Total ₹ of Quot. Raised</p>
                        <p className='relative-live'><span className='ripples'></span><span> ₹{RupeeAmount.toFixed(2)}</span></p>
                    </div>
                    <div>
                        <p>Total $ of Quot. Raised</p>
                        <p className='relative-live'><span className='ripples'></span><span> ${DollarsAmount.toFixed(2)}</span></p>
                    </div>
                </div>
            </div>
            <div className='line-chart'>
                <div><Line data={lineState} /></div>
                <div><Line data={lineStates} /></div>
            </div>
        </Fragment>
    )
}

export default Profile