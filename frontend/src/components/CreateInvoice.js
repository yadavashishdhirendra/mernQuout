import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './MetaData';
import './CreateInvoice.css'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, newInvoice } from '../actions/Invoiceaction';
import { CREATE_INVOICE_RESET } from '../constants/InvoiceConstants';
import DeleteIcon from '@material-ui/icons/Delete';
import Loader from './Loader/Loader';
import { Button } from '@material-ui/core'
import PlusIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import { useAlert } from 'react-alert';
import Tooltip from '@material-ui/core/Tooltip';

const CreateInvoice = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { error, loading, success } = useSelector((state) => state.Invoice)
    const [items, setItems] = useState([])

    const userTemplate = { itemname: "", itemdesc: "", itemsize: "", itemuom: "", itemqty: "", itemprice: "", pricesign: "", first: "", second: "", third: "", fourth: "", fifth: "", percentagesign: "" }
    const termsCondition = { title: "", userInput: "" }
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [companyname, setCompanyName] = useState("");
    const [revisionnumber, setRevisionNumber] = useState("");
    const [customerrefno, setCustomerRefNo] = useState("");
    const [projectname, setProjectName] = useState("");
    const [kindatt, setKindAtt] = useState("");
    const [validity, setValidity] = useState(null);
    const [products, setProducts] = useState([userTemplate]);
    const [terms, setTerms] = useState([termsCondition])
    const [pricebasis, setPriceBasis] = useState("");
    const [delivery, setDelivery] = useState("");
    const [warranty, setWarranty] = useState("");
    const [payment, setPayment] = useState("");
    const [mtc, setMTC] = useState("");
    const [packaging, setPackaging] = useState("");

    const onchange = (e, index) => {
        const addproduct = products.map((product, i) => index === i ? Object.assign(product, { [e.target.name]: e.target.value }) : product)
        setProducts(addproduct)
        const addproducts = products.map((product, i) => index === i ? Object.assign(product, { [e.target.name]: e.target.value }) : product)
        setItems(addproducts)
    }

    const termsChange = (e, index) => {
        const addTerms = terms.map((tData, i) => index === i ? Object.assign(tData, { [e.target.name]: e.target.value }) : tData)
        setTerms(addTerms)
    }


    const addField = (e) => {
        e.preventDefault();
        setProducts([...products, userTemplate])
        localStorage.setItem('data', JSON.stringify(products))
    }

    const addTermsField = (e) => {
        e.preventDefault();
        setTerms([...terms, termsCondition])
    }

    // BOTTOM CALCULATION CODE STARTS HERE
    const handleInput = function (e, index) {
        const addproduct = products.map((product, i) => index === i ? Object.assign(product, { [e.target.name]: e.target.value }) : product)
        setProducts(addproduct)
        const addproducts = products.map((product, i) => index === i ? Object.assign(product, { [e.target.name]: e.target.value }) : product)
        setItems(addproducts)
    };

    console.log(products)

    const [refs] = useState({
        first: React.createRef(),
        second: React.createRef(),
        third: React.createRef(),
        fourth: React.createRef(),
        fifth: React.createRef(),
        sum: React.createRef(),
    });

    const [vars] = useState({
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        fifth: 0,
        sum: 0,
    });

    let calculation = 0;
    products.forEach(data => {
        calculation = parseFloat(data.first) + parseFloat(data.second) + parseFloat(data.third) + parseFloat(data.fourth) + parseFloat(data.fifth)
        data['total'] = parseFloat(calculation);
    })

    let grandTotal = 0;
    products.forEach(totalAmt => {
        grandTotal += totalAmt.total
    })

    let marginCalculation = 0;
    products.forEach(data => {
        marginCalculation = parseFloat(data.first) * parseFloat(data.fifth) / 100 + parseFloat(data.first)
        data['marginCal'] = parseFloat(marginCalculation)
    })

    let marginAmts = 0;
    products.forEach(amt => {
        marginAmts += amt.marginCal
    })

    let percentsign;
    products.forEach(sign => {
        percentsign = sign.percentagesign
    })


    const onCalculator = (e) => {
        const { name, value } = e.target;
        vars[name] = value;
        // Could've used vars, but just use refs because we keep references to all 3
        const first = parseFloat(refs.first.current.value, 10);
        const second = parseFloat(refs.second.current.value, 10);
        const third = parseFloat(refs.third.current.value, 10);
        const fourth = parseFloat(refs.fourth.current.value, 10);
        const fifth = parseFloat(refs.fifth.current.value, 10);
        const sum = parseFloat(refs.sum.current.value, 10);
        // But you need refs to update
        if (name === 'first') refs.sum.current.value = first + second + third + fourth + fifth;
        if (name === 'second') refs.sum.current.value = first + second + third + fourth + fifth;
        if (name === 'third') refs.sum.current.value = first + second + third + fourth + fifth;
        if (name === 'fourth') refs.sum.current.value = first + second + third + fourth + fifth;
        if (name === 'fifth') refs.sum.current.value = first + second + third + fourth + fifth;
        if (name === 'sum') refs.second.current.value = sum + second;
    };

    // BOTTOM CALCULATION CODE ENDS HERE

    const minusField = (index, e) => {
        const filterProducts = [...products];
        filterProducts.splice(index, 1);
        setProducts(filterProducts)
        e.preventDefault();
    }

    const minusTermsField = (index, e) => {
        const filterTermsData = [...terms];
        filterTermsData.splice(index, 1)
        setTerms(filterTermsData)
        e.preventDefault();
    }
    const handleInvoice = (e) => {
        e.preventDefault();
        dispatch(newInvoice({ companyname, revisionnumber, customerrefno, projectname, kindatt, email, contact, validity, products, items, pricebasis, payment, delivery, mtc, warranty, packaging, terms }))
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
        if (success) {
            alert.success('Invoice Created Successfully!');
            history.push('/invoice-list')
            dispatch({
                type: CREATE_INVOICE_RESET
            })
        }
    }, [dispatch, error, success, alert, history])
    return (
        <Fragment>
            <form>
                <div className="calculator-boxes">
                    <div>
                        <label htmlFor="first">BASE PRICE</label>
                        <input ref={refs.first} onChange={onCalculator} defaultValue={vars.first} name="first" id="first" type="number" />
                    </div>
                    <div>
                        <label htmlFor="second">EXPENSES</label>
                        <input ref={refs.second} onChange={onCalculator} defaultValue={vars.second} name="second" id="second" type="number" />
                    </div>
                    <div>
                        <label htmlFor="second">SHIPPING</label>
                        <input ref={refs.third} onChange={onCalculator} defaultValue={vars.third} name="third" id="third" type="number" />
                    </div>
                    <div>
                        <label htmlFor="second">PACKAGING</label>
                        <input ref={refs.fourth} onChange={onCalculator} defaultValue={vars.fourth} name="fourth" id="fourth" type="number" />
                    </div>
                    <div>
                        <label htmlFor="second">MARGIN</label>
                        <input ref={refs.fifth} onChange={onCalculator} defaultValue={vars.fifth} name="fifth" id="fifth" type="number" />
                    </div>
                    <div>
                        <label htmlFor="sum">PRICE</label>
                        <input ref={refs.sum} onChange={onCalculator} readOnly defaultValue={vars.sum.toFixed(1)} id="sum" name="sum" type="number" />
                    </div>
                </div>
            </form>
            <div className="container create-invoice-wrapper">
                {
                    loading ? <Loader /> :
                        <Fragment>
                            <div className='count-grandTotal'>
                                <div className='grand-total'>
                                    <b>{percentsign === '%' ? "MarginTotal" : "Total"} -</b> {percentsign === '%' ? marginAmts.toFixed(2) : grandTotal ? grandTotal.toFixed(2) : <span>calculating...</span>}
                                </div>
                            </div>
                            <h1 className='text-center head-text'>Crea<span>te Quo</span>tation</h1>
                            <MetaData title='Create Quotation' />
                            <form onSubmit={handleInvoice}>
                                <div className='Header-inputs'>
                                    <div>
                                        <label htmlFor="">Email -</label>
                                        <input className='mb-4' name='email' value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Email *' /> <br />
                                        <label htmlFor="">Company Name -</label>
                                        <input className='mb-4' name='companyname' value={companyname} onChange={(e) => setCompanyName(e.target.value)} type="text" placeholder='Company Name *' /> <br />
                                        <label htmlFor="">Kind Att -</label>
                                        <input className='mb-4' name='kindatt' value={kindatt} onChange={(e) => setKindAtt(e.target.value)} type="text" placeholder='Kind Att' />
                                        <label htmlFor="">Contact No -</label>
                                        <input className='mb-4' name='contact' value={contact} onChange={(e) => setContact(e.target.value)} type="number" placeholder='Contact No *' /> <br />
                                    </div>
                                    <div>
                                        <label htmlFor="">Revision Number -</label>
                                        <input value={revisionnumber} name="revisionnumber" onChange={(e) => setRevisionNumber(e.target.value)} className='mb-4' type="number" placeholder='Revision Number' />
                                        <label htmlFor="">Customer Ref No -</label>
                                        <input value={customerrefno} name="customerrefno" onChange={(e) => setCustomerRefNo(e.target.value)} className='mb-4' type="text" placeholder='Customer Ref Number' />
                                        <label htmlFor="">Validity -</label>
                                        <input type="date" name="validity" placeholder='Validity' className='mb-4' value={validity} onChange={(e) => setValidity(e.target.value)} />
                                        <label htmlFor="">Project Name -</label>
                                        <input value={projectname} name="projectname" onChange={(e) => setProjectName(e.target.value)} className='mb-4' type="text" placeholder='Project Name' />
                                    </div>
                                </div>
                                <div className="container products-container">
                                    <label htmlFor="">Add Products -</label>
                                </div>
                                <div className='project-Input-Head'>
                                    {
                                        products.map((product, index) => {
                                            return (
                                                <div className='project-Inputs' key={index}>
                                                    <div>
                                                        <select className='mb-0' name='itemname' value={product.itemname} onChange={(e) => onchange(e, index)}>
                                                            <option value="">Choose Products</option>
                                                            <option value="Product 1">Product 1</option>
                                                            <option value="Product 2">Product 2</option>
                                                            <option value="Product 3">Product 3</option>
                                                            <option value="Product 4">Product 4</option>
                                                            <option value="Product 5">Product 5</option>
                                                            <option value="Product 6">Product 6</option>
                                                            <option value="Product 7">Product 7</option>
                                                            <option value="Product 8">Product 8</option>
                                                            <option value="Product 9">Product 9</option>
                                                            <option value="Product 10">Product 10</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <input className='mb-0' value={product.itemdesc} name="itemdesc" onChange={(e) => onchange(e, index)} type="text" placeholder='Item Description' />
                                                    </div>
                                                    <div>
                                                        <input className='mb-0' value={product.itemsize} name="itemsize" onChange={(e) => onchange(e, index)} type="text" placeholder='Size mm' />
                                                    </div>
                                                    <div>
                                                        <input className='mb-0' value={product.itemuom} name="itemuom" onChange={(e) => onchange(e, index)} type="text" placeholder='UOM' />
                                                    </div>
                                                    <div>
                                                        <input className='mb-0' value={product.itemqty} name="itemqty" onChange={(e) => onchange(e, index)} type="number" placeholder='Quantity' />
                                                    </div>
                                                    <div>
                                                        <input onChange={(e) => handleInput(e, index)} name="first" value={product.first} placeholder='Base Price' type="number" />
                                                    </div>
                                                    <div>
                                                        <input onChange={(e) => handleInput(e, index)} name="second" value={product.second} placeholder='Expenses' type="number" />
                                                    </div>
                                                    <div>
                                                        <input onChange={(e) => handleInput(e, index)} name="third" value={product.third} placeholder='Shipping' type="number" />
                                                    </div>
                                                    <div>
                                                        <input onChange={(e) => handleInput(e, index)} name="fourth" value={product.fourth} placeholder='Packaging' type="number" />
                                                    </div>
                                                    <div>
                                                        <input onChange={(e) => handleInput(e, index)} name="fifth" value={product.fifth} placeholder='Margin' type="number" />
                                                    </div>
                                                    <div>
                                                        <select className='mb-0' name='pricesign' value={product.pricesign} onChange={(e) => onchange(e, index)} required>
                                                            <option value="">Currency *</option>
                                                            <option value='₹'>₹</option>
                                                            <option value='＄'>＄</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <select className='mb-0' name='percentagesign' value={product.percentagesign} onChange={(e) => onchange(e, index)}>
                                                            <option value="">Choose option</option>
                                                            <option value='%'>%</option>
                                                        </select>
                                                    </div>
                                                    <Tooltip title="Delete Field" arrow><Button className='minus-field' variant="contained" onClick={() => minusField(index)}><DeleteIcon /></Button></Tooltip>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className='text-center'>
                                        <Tooltip title="Add Field" arrow><Button className='add-more mt-0' variant="contained" id='btn' onClick={addField}><PlusIcon /></Button></Tooltip>
                                    </div>
                                    <div className='terms-condition'>
                                        <div>
                                            <label htmlFor="">Price Basis -</label> <br />
                                            <input className='mb-4' name='pricebasis' value={pricebasis} type="text" onChange={(e) => setPriceBasis(e.target.value)} placeholder='Price Basis *' /> <br />
                                            <label htmlFor="">Delivery -</label> <br />
                                            <input className='mb-4' name='delivery' value={delivery} type="text" onChange={(e) => setDelivery(e.target.value)} placeholder='Delivery *' /> <br />
                                            <label htmlFor="">Warranty -</label> <br />
                                            <input className='mb-4' name='warranty' value={warranty} type="text" onChange={(e) => setWarranty(e.target.value)} placeholder='Warranty *' /> <br />
                                        </div>
                                        <div>
                                            <label htmlFor="">Payment -</label> <br />
                                            <input className='mb-4' name='payment' value={payment} type="text" onChange={(e) => setPayment(e.target.value)} placeholder='Payment *' /> <br />
                                            <label htmlFor="">MTC -</label> <br />
                                            <input className='mb-4' name='mtc' type="text" value={mtc} onChange={(e) => setMTC(e.target.value)} placeholder='MTC *' /> <br />
                                            <label htmlFor="">Packaging -</label> <br />
                                            <input className='mb-4' name='packaging' value={packaging} type="text" onChange={(e) => setPackaging(e.target.value)} placeholder='Packaging *' /> <br />
                                        </div>
                                    </div>
                                    {/* Extra Field for Terms & Condition */}
                                    <div className='border'>
                                        <p><span>Extra Fiels For T&C -</span></p>
                                        <div className='border-gap'>
                                            {
                                                terms.map((tData, index) => {
                                                    return (
                                                        <div className="extra-field" key={index}>
                                                            <div>
                                                                <input className='title' type="text" onChange={(e) => termsChange(e, index)} value={tData.title} placeholder='Enter Terms Title' name="title" />
                                                                <input className='userInput' type="text" onChange={(e) => termsChange(e, index)} value={tData.userInput} placeholder='Enter your condition' name="userInput" />
                                                                <Tooltip title="Delete Field" arrow><Button className='minus-field mt-3' variant="contained" onClick={() => minusTermsField(index)}><DeleteIcon /></Button></Tooltip>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className='text-center'>
                                            <Tooltip title="Add Field" arrow><Button className='add-more mb-3' variant="contained" id='btn' onClick={addTermsField}><PlusIcon /></Button></Tooltip>
                                        </div>
                                    </div>
                                    {/* Extra Field for Terms & condition */}
                                    <Button type='submit' variant="contained" className='submit-button mt-5'>Create Quotation &nbsp; <SendIcon /></Button>
                                </div>
                            </form>
                        </Fragment>
                }
            </div>
        </Fragment>
    )
}

export default CreateInvoice
