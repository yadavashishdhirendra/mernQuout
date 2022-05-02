import {
    CREATE_INVOICE_REQUEST,
    CREATE_INVOICE_SUCCESS,
    CREATE_INVOICE_FAIL,
    CLEAR_ERRORS,
    GET_ALLINVOICE_REQUEST,
    GET_ALLINVOICE_SUCCESS,
    GET_ALLINVOICE_FAIL,
    GET_SINGLE_INVOICE_REQUEST,
    GET_SINGLE_INVOICE_SUCCESS,
    GET_SINGLE_INVOICE_FAIL,
    INVOICE_DELETE_REQUEST,
    INVOICE_DELETE_SUCCESS,
    INVOICE_DELETE_FAIL,
    INVOICE_UPDATE_REQUEST,
    INVOICE_UPDATE_SUCCESS,
    INVOICE_UPDATE_FAIL,
    GET_LOGGED_IN_INVOICE_REQUEST,
    GET_LOGGED_IN_INVOICE_SUCCESS,
    GET_LOGGED_IN_INVOICE_FAIL,
    UPDATE_STATUS_REQUEST,
    UPDATE_STATUS_SUCCESS,
    UPDATE_STATUS_FAIL
} from "../constants/InvoiceConstants";
import axios from 'axios';


// CREATE NEW INVOICE
export const newInvoice = (companyname, revisionnumber, customerrefno, projectname, kindatt, email, contact, validity, itemname, products, items, pricebasis, delivery, warranty, payment, mtc, packaging, terms) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_INVOICE_REQUEST
        })
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const { data } = await axios.post(`/api/v1/createinvoice`, companyname, revisionnumber, customerrefno, projectname, kindatt, email, contact, validity, itemname, products, items, pricebasis, delivery, warranty, payment, mtc, packaging, terms, config)
        dispatch({
            type: CREATE_INVOICE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CREATE_INVOICE_FAIL,
            payload: error.response.data.message
        })
    }
}

// GET ALL INVOICE
export const getInvoice = (month, value) => async (dispatch) => {
    try {
        dispatch({
            type: GET_ALLINVOICE_REQUEST
        })
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const { data } = await axios.post(`/api/v1/getinvoice`, { month, value }, config);
        dispatch({
            type: GET_ALLINVOICE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: GET_ALLINVOICE_FAIL,
            payload: error.response.data.message
        })
    }
}

// GET SINGLE INVOICE
export const getSingleInvoice = (id) => async (dispatch) => {
    try {
        dispatch({
            type: GET_SINGLE_INVOICE_REQUEST
        })

        const { data } = await axios.get(`/api/v1/getsingleinvoice/${id}`);
        dispatch({
            type: GET_SINGLE_INVOICE_SUCCESS,
            payload: data.getInvoice
        })
    } catch (error) {
        dispatch({
            type: GET_SINGLE_INVOICE_FAIL,
            payload: error.response.data.message
        })
    }
}

// DELETE INVOICE
export const deleteInvoice = (id) => async (dispatch) => {
    try {
        dispatch({
            type: INVOICE_DELETE_REQUEST
        })

        const { data } = await axios.delete(`/api/v1/deleteinvoice/${id}`);
        dispatch({
            type: INVOICE_DELETE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: INVOICE_DELETE_FAIL,
            payload: error.response.data.message
        })
    }
}

// UPDATE INVOICE
export const updateInvoice = (id, companyname, revisionnumber, customerrefno, projectname, kindatt, email, contact, validity, products, items, pricebasis, delivery, warranty, payment, mtc, packaging, terms, termsData) => async (dispatch) => {
    try {
        dispatch({
            type: INVOICE_UPDATE_REQUEST
        })

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const { data } = await axios.put(`/api/v1/updateinvoice/${id}`, companyname, revisionnumber, customerrefno, projectname, kindatt, email, contact, validity, products, items, pricebasis, delivery, warranty, payment, mtc, packaging, terms, termsData, config);
        dispatch({
            type: INVOICE_UPDATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: INVOICE_UPDATE_FAIL,
            payload: error.response.data.message
        })
    }
}

// GET LOGGED IN USER PRODUCTS
export const getLoggedInvoice = (month, value) => async (dispatch) => {
    try {
        dispatch({
            type: GET_LOGGED_IN_INVOICE_REQUEST
        })
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const { data } = await axios.post(`/api/v1/logged/invoice`, { month, value }, config);
        dispatch({
            type: GET_LOGGED_IN_INVOICE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: GET_LOGGED_IN_INVOICE_FAIL,
            payload: error.response.data.message
        })
    }
}

// UPDATE INVOICE STATUS
export const updateInvoiceStatus = (id, status) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_STATUS_REQUEST
        })
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const { data } = await axios.put(`/api/v1/invoice-details/${id}`, { status }, config);
        dispatch({
            type: UPDATE_STATUS_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_STATUS_FAIL,
            payload: error.response.data.message
        })
    }
}

// clearing errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}