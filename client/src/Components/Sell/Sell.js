import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from './Sell.module.css'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, IconButton } from '@mui/material';
import { Stack } from '@mui/system'
import { toast } from 'react-toastify'


function Sell() {

    const navigate = useNavigate()
    const [sell, setSell] = useState([])
    const user = useSelector((state) => state.user.userInfo);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);

    const getData = () => {
        axios.get("http://localhost:5000/api/Sellitem/" + user.id, { withCredentials: true })
            .then((res) => {
                console.log(res.data.data);
                setSell(res.data.data)
            }
            )
            .catch((err) => {
                console.log(err);
            })
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEdit = (item) => {
        navigate("/Selledit", { state: { data: item } })
    }
    const handleDelete = (item) => {
        console.log(item.id);
        let data =
        {
            id: item.id
        }
        axios.post("http://localhost:5000/api/deleteSell", data, { withCredentials: true })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    toast.success('Success', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    getData()
                }
            }).catch((err) => {
                if (err) {
                    toast.error('Failed', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
    }



    const joinhandle = () => {
        navigate("/Sellitem")
    }

    useEffect(() => {
        getData()

    }, [])



    return (
        <div className={styles.Main}>
            <div className={styles.heads}>
                <h1>Manage Bid</h1>
                <div className={styles.buttonHolder}><button className={styles.button1} onClick={joinhandle}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" /> </svg>{' '}
                    Bid an Item</button></div>
            </div>


            <div className={styles.okok}>
                <div className={styles.headss}><p>Items</p></div>
                <TableContainer className={styles.container}  >
                    <Table className={styles.table} sx={{ minWidth: 1 }} aria-label="simple table" color="#F7F6F2">

                        <TableHead sx={{ color: 'white' }}>
                            <TableRow>
                                <TableCell className={styles.headTitle} ></TableCell>
                                <TableCell className={styles.headTitle} >Title</TableCell>
                                <TableCell className={styles.headTitle} >Category</TableCell>
                                <TableCell className={styles.headTitle} >Min Price</TableCell>
                                <TableCell className={styles.headTitle} >StartTime</TableCell>
                                <TableCell className={styles.headTitle} >EndTime</TableCell>
                                <TableCell className={styles.headTitle} >Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody >

                            {sell.length === 0 && <TableRow >
                                <TableCell colspan="7" style={{ "text-align": "center", }}>No item yet</TableCell>
                            </TableRow>}

                            {sell.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) =>
                            (
                                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell className={styles.ind} align="left">{index + 1}</TableCell>
                                    <TableCell className={styles.ind} component="th" scope="row"><b>{item.title.toUpperCase()}</b></TableCell>
                                    <TableCell className={styles.ind} component="th">{item.category}</TableCell>
                                    <TableCell className={styles.ind} component="th">{item.amount}</TableCell>
                                    <TableCell className={styles.ind} component="th">{item.startTime}</TableCell>
                                    <TableCell className={styles.ind} component="th">{item.endTime}</TableCell>
                                    <TableCell component="th" align='left'>
                                        <Stack direction="row" spacing={0} sx={{ marginTop: '-15px' }}>
                                            <IconButton color="primary" aria-label="add to shopping cart"><DeleteIcon style={{ color: '#E53472' }} onClick={() => { handleDelete(item) }} /></IconButton>

                                            <IconButton color="primary" aria-label="add to shopping cart">
                                                <EditIcon style={{ color: '#2A84EB' }} onClick={() => handleEdit(item)} />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[7]}
                    component="div"
                    count={sell.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>





        </div>
    )
}

export default Sell