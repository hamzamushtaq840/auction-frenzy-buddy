import express from "express";
import dotenv from "dotenv";
import { pool } from "../index.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import Jwt from "jsonwebtoken";
import dayjs from "dayjs";
dotenv.config();

export const Sellitem = async (req, res) => {

    console.log(req.body);
    const { userId, category, title, description, amount, startTime, endTime, imageURL } = req.body
    const query = "INSERT INTO sell (userId,category, title, description,amount, startTime,endTime ,imageURL) VALUES (?,?,?,?,?,?,?,?)";
    pool.query(query, [userId, category, title, description, amount, startTime, endTime, imageURL], (err, row, field) => {
        if (err) {
            console.log(err)
            res.status(500).send({
                message: "Some error",
            });
        }
        if (row) {
            console.log(row);
            res.status(200).send({
                message: "Blogs published successfully",
            });
        }
    })
}



export const getAllSell = async (req, res) => {
    const { userId } = req.params
    console.log(userId);

    const query = "SELECT * FROM sell where userId= ?";
    pool.query(query, [userId], (err, row, field) => {
        if (err) { console.log(err) }
        if (row) {
            if (row.length === 0) {
                res.send({ data: [] })
                console.log('data sent')
                console.log(row);
            }
            else {
                row.reverse()
                res.send({ data: row })
                console.log(row);
            }
        }
    })
}



export const EditSellitem = async (req, res) => {

    const { id, userId, category, title, description, amount, startTime, endTime, imageURL } = (req.body)

    pool.query('Update sell SET userId=?, category=?, title=?, description=?, amount=?, startTime=?, endTime=?, imageURL=?  WHERE id=? ', [userId, category, title, description, amount, startTime, endTime, imageURL, id], (err, row, field) => {
        if (err)
            console.log(err)
        if (row) {
            res.status(200).send({ message: 'Updated', })
        };
    })
}

export const deleteSell = async (req, res) => {

    const { id } = req.body

    pool.query('DELETE FROM sell where id=?', [id], (err, row, field) => {
        if (err)
            console.log(err)
        if (row)
            res.status(200).send({ message: "deleted" });
    })
}


export const getAllSells = async (req, res) => {

    const query = "SELECT * FROM sell";
    pool.query(query, (err, row, field) => {
        if (err) { console.log(err) }
        if (row) {
            if (row.length === 0) {
                res.send({ data: [] })
                console.log('data sent')
                console.log(row);
            }
            else {
                row.reverse()
                res.send({ data: row })
                console.log(row);
            }
        }
    })
}
export const Biditem = async (req, res) => {

    const { userId, bidId, price } = (req.body)
    const query1 = "SELECT * FROM bids where userId=? And bidId=?";
    const query2 = "INSERT INTO bids (userId,bidId,price) VALUES (?,?,?)";
    const query3 = "SELECT * FROM bids where bidId=?";


    pool.query(query3, [bidId], (err, rows, field) => {
        if (err) { console.log(err) }
        if (rows) {
            if (rows.length === 0) {
                pool.query(query2, [userId, bidId, price], (err, row, field) => {
                    if (err)
                        console.log(err)
                    if (row) {
                        res.status(200).send({ message: 'Bid Added', })
                    }
                })
            }
            else {
                const maxValueOfY = Math.max(...rows.map(o => o.price), 0);
                console.log(maxValueOfY)
                if (price <= maxValueOfY) {
                    res.status(501).send({ message: `Sorry last bid was ${maxValueOfY}` })
                }
                else {
                    pool.query(query2, [userId, bidId, price], (err, row, field) => {
                        if (err)
                            console.log(err)
                        if (row) {
                            res.status(200).send({ message: 'Bid Added', })
                        }
                    })
                }
            }

        }
    })


}


export const BidNotification = async (req, res) => {
    function getDifference(createdAt) {
        const firstDate = dayjs(createdAt);
        const currentDate = dayjs();
        const differenceInSeconds = currentDate.diff(firstDate, "second");

        if (differenceInSeconds < 60) {
            return `${differenceInSeconds}`;
        }
        else {
            return 'no'
        }
    }

    const query1 = " SELECT sell.id,sell.userId,sell.amount,sell.endTime,sell.title,users.email FROM sell INNER JOIN users ON sell.userId = users.id";
    const query2 = "SELECT bids.id,bids.userId,bids.bidId,bids.price,users.email FROM bids  INNER JOIN users ON bids.userId = users.id  where bidId=? ";
    const query3 = "INSERT INTO notifications (userId,text) VALUES (?,?)";
    const query4 = "SELECT * FROM notifications where userId=? AND text=?";


    pool?.query(query1, (err, row, field) => {
        if (err)
            console.log(err)
        if (row) {
            row.forEach((value) => {
                // console.log(getDifference(value.endTime));
                if (getDifference(value.endTime) === '0') {
                    pool?.query(query2, [value.id], (e, r, field) => {
                        if (e) { console.log(e) }
                        if (r) {
                            let text = `Congratulations! You have won bid for ${value.title} contact ${value.email} `
                            const maxValueOfY = Math.max(...r.map(o => o.price), 0);
                            var result = r.filter(obj => {
                                return obj.price === maxValueOfY
                            })
                            let text2 = `Congratulations! ${result[0].price} was highest bid contact ${result[0].email} `

                            pool?.query(query4, [result[0].userId, text], (ee, rr, ff) => {
                                console.log(rr);
                                if (rr.length === 0) {
                                    pool?.query(query3, [result[0].userId, text], (err, row, field) => {
                                        if (err)
                                            console.log(err)
                                        if (row) {
                                            pool?.query(query4, [result[0].userId, text], (ee, rr, ff) => {
                                                console.log(rr);
                                                if (rr.length === 0) {
                                                    pool?.query(query3, [value.userId, text2], (err, row, field) => {
                                                        if (err)
                                                            console.log(err)
                                                        if (row) {
                                                            // console.log(text);
                                                        }
                                                    })
                                                }
                                            })
                                            // console.log(text);
                                        }
                                    })
                                }
                            })


                        }
                    })
                }
            })
        }
    })



}

export const getNotification = (req, res) => {
    const { userId } = req.params
    pool.query('Select * from notifications where userId=?', userId, (err, row, field) => {
        if (err)
            console.log(err)
        if (row)
            res.status(200).send({ data: row })
    })
}



export const removeNotification = (req, res) => {
    const { id } = req.body
    pool.query('Delete from notifications where id=?', id, (err, row, field) => {
        if (err)
            console.log(err)
        if (row)
            res.status(200).send({ message: 'deleted' })
    })
}