import React, { useEffect, useState } from 'react'
import styles from './UserDashboard.module.css'
import axios from 'axios';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';
import moment from "moment";
import { toast } from 'react-toastify';


function UserDashboard() {
    const [category, setCategory] = useState("All")
    const [items, setItems] = useState([])
    const [items2, setItems2] = useState([])
    const navigate = useNavigate()

    useEffect(() => {

        axios.get("http://localhost:5000/api/getAllSells", { withCredentials: true })
            .then((res) => {
                console.log(res.data.data);
                setItems(res.data.data)
                setItems2(res.data.data)
            }).catch((err) => {
                console.log(err)
            })

    }, [])


    var DateDiff = {

        inDays: function (d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();

            return Math.floor((t2 - t1) / (24 * 3600 * 1000));
        },

        inWeeks: function (d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();

            return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
        },

        inMonths: function (d1, d2) {
            var d1Y = d1.getFullYear();
            var d2Y = d2.getFullYear();
            var d1M = d1.getMonth();
            var d2M = d2.getMonth();

            return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
        },

        inYears: function (d1, d2) {
            return d2.getFullYear() - d1.getFullYear();
        }
    }

    // var dString = "May, 20, 1984";

    // var d1 = new Date(dString);
    // var d2 = new Date();

    // document.write("<br />Number of <b>days</b> since " + dString + ": " + DateDiff.inDays(d1, d2));
    // document.write("<br />Number of <b>weeks</b> since " + dString + ": " + DateDiff.inWeeks(d1, d2));
    // document.write("<br />Number of <b>months</b> since " + dString + ": " + DateDiff.inMonths(d1, d2));
    // document.write("<br />Number of <b>years</b> since " + dString + ": " + DateDiff.inYears(d1, d2));


    function getDaysBetweenDates(d0, d1) {

        var msPerDay = 8.64e7;

        // Copy dates so don't mess them up
        var x0 = new Date(d0);
        var x1 = new Date(d1);

        // Set to noon - avoid DST errors
        x0.setHours(12, 0, 0);
        x1.setHours(12, 0, 0);

        // Round to remove daylight saving errors
        return Math.round((x1 - x0) / msPerDay);
    }

    function getDateDiff(time1, time2) {
        var str1 = time1.split('/');
        var str2 = time2.split('/');

        //                yyyy   , mm       , dd
        var t1 = new Date(str1[2], str1[0] - 1, str1[1]);
        var t2 = new Date(str2[2], str2[0] - 1, str2[1]);

        var diffMS = t1 - t2;
        console.log(diffMS + ' ms');

        var diffS = diffMS / 1000;
        console.log(diffS + ' ');

        var diffM = diffS / 60;
        console.log(diffM + ' minutes');

        var diffH = diffM / 60;
        console.log(diffH + ' hours');

        var diffD = diffH / 24;
        console.log(diffD + ' days');
        alert(diffD);
    }


    function getDifference(createdAt) {
        const firstDate = dayjs(createdAt);
        const currentDate = dayjs();
        const differenceInMinutes = currentDate.diff(firstDate, "minute");
        const minutesInDay = 1440;
        const minutesInWeek = 10080;
        const minutesInMonth = 43800;
        const minutesInYear = 525600;

        if (differenceInMinutes < 60) {
            return `${differenceInMinutes}m`;
        } else if (differenceInMinutes > 60 && differenceInMinutes < minutesInDay) {
            return `${currentDate.diff(firstDate, "hour")}h`;
        } else if (
            differenceInMinutes > minutesInDay &&
            differenceInMinutes < minutesInWeek
        ) {
            return `${currentDate.diff(firstDate, "day")}d`;
        } else if (
            differenceInMinutes > minutesInWeek &&
            differenceInMinutes < minutesInMonth
        ) {
            return `${currentDate.diff(firstDate, "week")}w`;
        } else if (
            differenceInMinutes > minutesInMonth &&
            differenceInMinutes < minutesInYear
        ) {
            return `${currentDate.diff(firstDate, "month")}m`;
        } else if (differenceInMinutes >= minutesInYear) {
            return `${currentDate.diff(firstDate, "year")}y`;
        } else {
            return `${currentDate.diff(firstDate, "day")}d`;
        }
    }


    const handleBidDetails = (item) => {
        navigate("/BidDetails", { state: { data: item } })
    }

    const [counter, setCounter] = useState(0)
    const [timeFinished, setTimeFinished] = useState(false)

    setTimeout(() => {
        setCounter(counter + 1)
    }, 10);

    useEffect(() => {

    }, [counter])


    const checkStartTme = (startTime) => {
        let today = new Date();
        today = today.toLocaleString()

        let assignmentStartTime = new Date(startTime)
        assignmentStartTime = assignmentStartTime.toLocaleString()

        let newassignmentStartTime = moment(assignmentStartTime)

        if (newassignmentStartTime.isBefore(today)) {
            return true
        }
        else {
            return false
        }
    }


    const checkEndTme = (endTime) => {
        let today = new Date();
        today = today.toLocaleString()

        let assignmentStartTime = new Date(endTime)
        assignmentStartTime = assignmentStartTime.toLocaleString()

        let newassignmentStartTime = moment(assignmentStartTime)

        if (newassignmentStartTime.isBefore(today)) {
            return true
        }
        else {
            return false
        }
    }

    const checkTime = (startTime, endTime) => {


        // checkStartTme(startTime) ? styles.job : styles.job2
        // console.log(startTime, endTime);

    }


    return (
        <div className={styles.Main}>

            <div className={styles.category}>

                <FilterAltIcon style={{ fontSize: '30px' }} />
                <select defaultValue={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Property for Sale">Property for Sale</option>
                    <option value="Property for Rent">Property for Rent</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Bikes">Bikes</option>
                    <option value="Mobiles">Mobiles</option>
                    <option value="Electronics & Home Appliances ">Electronics & Home Appliances </option>
                    <option value="Bussiness,Industrial & Appliances">Bussiness,Industrial & Appliances</option>
                    <option value="Services">Services</option>
                    <option value="Jobs">Jobs</option>
                    <option value="Animals">Animals</option>
                    <option value="Furniture & Home Decor">Furniture & Home Decor</option>
                    <option value="Fashion & Beauty">Fashion & Beauty</option>
                    <option value="Books,Sports & Hobbies">Books,Sports & Hobbies</option>
                    <option value="Kids">Kids</option>
                </select>
            </div>

            <div className={styles.cardHolder}>
                {
                    items
                        .filter(i => i.category === category && category !== 'All')
                        .map((item, index) => {
                            if (checkEndTme(item.endTime) === false)
                                return (

                                    <div key={item.id} className={styles.job}>

                                        <div className={styles.head}>
                                            <div className={styles.companyLogo} style={{ backgroundImage: `url(${item.imageURL})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                            {!checkStartTme(item.startTime) && <p className={styles.red}>Upcoming</p>}
                                        </div>
                                        <p className={styles.jobTitle}>{item.title}</p>
                                        <p className={styles.jobDescription}>{item.description}</p>
                                        <div className={styles.abc}>
                                            {!checkStartTme(item.startTime) && <div className={styles.hold}>Starts at {item.startTime} </div>}
                                            {checkStartTme(item.startTime) && <div className={styles.hold}>Ends at {item.endTime} </div>}
                                        </div>
                                        {checkStartTme(item.startTime) && <div className={styles.footer}>
                                            {/* <p>Starts In: <span>{getDifference(item.startTime)}</span> </p> */}
                                            <button className={styles.apply} onClick={event => {
                                                event.stopPropagation(); // <-- this stops the click going through to the parent div
                                                if (checkEndTme(item.endTime)) {
                                                    toast.error("Bid has expired", {
                                                        position: toast.POSITION.TOP_RIGHT,
                                                    });
                                                }
                                                else if (checkStartTme(item.startTime)) {
                                                    handleBidDetails(item) // <-- this stops the click going through to the parent div
                                                }
                                                else {
                                                    toast.error("Bid will start in soon", {
                                                        position: toast.POSITION.TOP_RIGHT,
                                                    });
                                                }// <-- this stops the click going through to the parent div
                                            }} >View</button>
                                        </div>}
                                    </div>)
                            return (
                                <></>
                            )
                        })
                }


                {
                    category === 'All' &&
                    items2
                        .map((item, index) => {
                            if (checkEndTme(item.endTime) === false)
                                return (


                                    <div key={item.id} className={styles.job}>
                                        <div className={styles.head}>
                                            <div className={styles.companyLogo} style={{ backgroundImage: `url(${item.imageURL})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                            {!checkStartTme(item.startTime) && <p className={styles.red}>Upcoming</p>}
                                        </div>
                                        <p className={styles.jobTitle}>{item.title}</p>
                                        <p className={styles.jobDescription}>{item.description}</p>
                                        <div className={styles.abc}>
                                            {!checkStartTme(item.startTime) && <div className={styles.hold2}>Starts at {item.startTime} </div>}
                                            {checkStartTme(item.startTime) && <div className={styles.hold}>Ends at {item.endTime} </div>}
                                        </div>
                                        {checkStartTme(item.startTime) && <div className={styles.footer}>
                                            {/* <p>Starts In: <span>{getDifference(item.startTime)}</span> </p> */}
                                            <button className={styles.apply} onClick={event => {
                                                event.stopPropagation();
                                                if (checkEndTme(item.endTime)) {
                                                    toast.error("Bid has expired", {
                                                        position: toast.POSITION.TOP_RIGHT,
                                                    });
                                                }
                                                else if (checkStartTme(item.startTime)) {
                                                    handleBidDetails(item) // <-- this stops the click going through to the parent div
                                                }
                                                else {
                                                    toast.error("Bid will start in soon", {
                                                        position: toast.POSITION.TOP_RIGHT,
                                                    });
                                                }
                                            }} >View</button>
                                        </div>}
                                    </div>)
                            return (
                                <></>
                            )
                        })
                }

            </div>

        </div>

    )
}

export default UserDashboard