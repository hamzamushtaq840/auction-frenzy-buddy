import axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import styles from './BidDetails.module.css'
import BidPrice from './BidPrice'

function BidDetails() {
    const location = useLocation()
    const [BidDetail, setBidDetail] = useState(location.state.data)
    const [openModal, setOpenModal] = useState(false)
    const user = useSelector((state) => state.user.userInfo);

    const handleBid = () => {

        if (location.state.data.userId === user.id) {
            toast.error('You can not bid on your item', {
                position: toast.POSITION.TOP_RIGHT,
            });
            return
        }
        else {
            setOpenModal(true)
        }
    }

    return (
        <div className={styles.Main}>
            <div className={styles.company}>
                <div className={styles.titleHead}>
                    <h3 className={styles.companyName}>{BidDetail.rollno}</h3>
                    <h1 className={styles.title}>{BidDetail.title}</h1>
                </div>
            </div>

            <div className={styles.body}>
                <div className={styles.body2}>
                    <img style={{ height: '200px', width: '400px' }} src={BidDetail.imageURL} />
                    <p className={styles.p}><span>Category : </span>{BidDetail.category}</p>
                    <div className={styles.description}>
                        <p className={styles.p}><span>Description :</span></p>
                        <p className={styles.desc}>{BidDetail.description}</p>
                    </div>
                </div>
                <div className={styles.footer}>
                    <button onClick={handleBid} className={styles.bid}>Bid</button>
                </div>
            </div>
            {openModal && <BidPrice closeModal={setOpenModal} data={location.state.data} />}
        </div>
    )
}

export default BidDetails