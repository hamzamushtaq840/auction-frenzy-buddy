import { FormControl, Input, InputLabel, TextField } from '@mui/material'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styles from './BidPrice.module.css'

function BidPrice({ closeModal, data }) {

    const [price, setPrice] = useState("")
    const user = useSelector((state) => state.user.userInfo);
    let amount = data.amount
    let id = data.id


    function handle(e) {
        e.preventDefault()

        if (price < amount) {
            toast.error(`Min bid is ${amount}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            return
        }

        const data = {
            userId: user.id,
            bidId: id,
            price: price
        }
        console.log(data);
        axios.post("http://localhost:5000/api/Biditem", data, { withCredentials: true })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    toast.success('Bid successfully done', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            }).catch((err) => {
                console.log(err);
                if (err.response.status === 500) {
                    toast.error('You have already bid on it', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                if (err.response.status === 501) {
                    toast.error(err.response.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })

    }

    return (
        <>
            <div className={styles.modalBackground} onClick={() => closeModal(false)}></div>
            <form className={styles.modalContainer} onSubmit={handle}>
                <h1>Bid Price</h1>
                <div className={styles.form2}>
                    <TextField
                        id="component-helper"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        type='number' label="Price" variant="outlined" />
                    <button className={styles.button1} type='submit'>Bid on it</button>
                </div>
            </form>
        </>
    )
}

export default BidPrice