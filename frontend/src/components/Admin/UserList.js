import React, { Fragment, useEffect } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getAllUsers } from '../../actions/Useraction';
import MetaData from '../MetaData';
import SideBar from './SideBar'
import './UserList.css'
import { DataGrid } from '@material-ui/data-grid';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ViewIcon from '@material-ui/icons/RemoveRedEye';
import Loader from '../Loader/Loader';
import { clearErrors } from '../../actions/Invoiceaction';
import { USER_DELETE_RESET } from '../../constants/UserConstants';

const UserList = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading: userLoading, error, users } = useSelector((state) => state.getAllUsers)
    const { loading, isDeleted } = useSelector((state) => state.passUpdate)

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id))
    }

    const columns = [
        { field: "id", headerName: "User Id", minWidth: 200, flex: 0.5 },
        { field: "createdAt", headerName: "Issue Date", minWidth: 200, flex: 0.5 },
        { field: "name", headerName: "Name", minWidth: 150, flex: 0.5 },
        { field: "email", headerName: "Email", minWidth: 200, flex: 0.6 },
        {
            field: "actions", headerName: "Actions", type: 'number', minWidth: 200, flex: 0.5, sortable: false, renderCell: (params) => {
                return (
                    <Fragment>
                        <Tooltip arrow title="View">
                            <Link to={`/admin/getsingleuser/${params.getValue(params.id, "id")}`}>
                                <Button className='btn-green'>
                                    <ViewIcon />
                                </Button>
                            </Link>
                        </Tooltip>
                        <Tooltip arrow title="Delete">
                            <Button onClick={() => deleteUserHandler(params.getValue(params.id, "id"))} className='btn-red'>
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
                    </Fragment>
                )
            }
        }
    ];

    const rows = [];

    users && users.forEach((item) => {
        return (
            rows.push({
                id: item._id,
                createdAt: String(item.created_At).substr(0, 10),
                name: item.name,
                email: item.email
            })
        )
    })

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (isDeleted) {
            alert.success("User Deleted Success");
            dispatch({
                type: USER_DELETE_RESET
            })
        }
        dispatch(getAllUsers())
    }, [dispatch, alert, error, isDeleted])

    return (
        <Fragment>
            <MetaData title='Admin - User List' />
            {
                loading || userLoading ? <Loader /> :
                    <div className='dashboard-row'>
                        <div className='dashboard-col'>
                            <SideBar />
                        </div>
                        <div className='dashboard-aside-col'>
                            <div className='dashboard-algn-col'>
                                <div className="container text-container-wrapper">
                                    <h3 className='text-center'>Us<span>er Li</span>st</h3>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        pageSize={10}
                                        className="mt-5"
                                        autoHeight
                                        sortingOrder='null'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </Fragment>
    )
}

export default UserList