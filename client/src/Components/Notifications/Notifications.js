import styles from './Notifications.module.css';
import React, { useState } from 'react';
import { useEffect } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';


const Notification = () => {

    const user = useSelector(state => state.user.userInfo);
    const [notifications, setNotifications] = useState([])

    const handleRemove = (item) => {
        let data = {
            id: item.id
        }
        axios.post("http://localhost:5000/api/removeNotification", data, { withCredentials: true }).then((res) => {
            fetchNotifications()
        }).catch((err) => {
            console.log(err);
        })
    }

    const fetchNotifications = () => {

        axios.get("http://localhost:5000/api/getNotification/" + user.id, { withCredentials: true },
        ).then((res) => {
            let newData = res.data.data.reverse()
            console.log(res);
            console.log(newData);
            setNotifications(newData)
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchNotifications()
    }, [])


    return (
        <div className={styles.Main}>
            <div className={styles.header}>
                <h1>Notification</h1>
            </div>

            <div className={styles.body}>
                {notifications.map((item, index) =>
                (
                    <div>
                        <div className={styles.notificationContainer3}>
                            <div className={styles.p}>
                                <p>{item.text}</p>
                            </div>
                            <span onClick={() => handleRemove(item)}>x</span>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
}

export default Notification;
