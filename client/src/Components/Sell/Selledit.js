import React, { useRef, useState } from 'react'
import styles from './Sellitem.module.css'
import TextField from '@mui/material/TextField';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stack } from '@mui/system';
import { Storage } from "./../../Utils/firebase";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage"

function Selledit() {
    const location = useLocation()
    const [category, setCategory] = useState(location.state.data.category)
    const formRef = useRef();
    const [startTime, setStartTime] = useState(location.state.data.startTime)
    const [endTime, setEndTime] = useState(location.state.data.endTime)
    const [imageURL, setImageURL] = useState(location.state.data.imageURL);
    const [amount, setAmount] = useState(location.state.data.amount);
    const [file, setfile] = useState('');
    const [image, setImage] = useState('');
    const user = useSelector((state) => state.user.userInfo);
    const navigate = useNavigate()


    const handleJob = (e) => {
        e.preventDefault()

        console.log(user.id);

        if (startTime === "" || endTime === "") {
            toast.error('Fill all fields', {
                position: toast.POSITION.TOP_RIGHT,
            });
            return
        }
        else {
            if (imageURL === "") {
                toast.error('Please add picture', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                return
            }
            else if (amount === 1 || amount === "") {
                toast.error('Amount can not be this less', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                return
            }
            else {
                let data = {
                    id: location.state.data.id,
                    userId: user.id,
                    category: category,
                    title: formRef.current.title.value,
                    description: formRef.current.description.value,
                    amount: amount,
                    startTime: startTime,
                    endTime: endTime,
                    imageURL: imageURL,
                }
                axios.post("http://localhost:5000/api/EditSellitem", data, { withCredentials: true })
                    .then((res) => {
                        console.log(res);
                        if (res.status === 200) {
                            toast.success('Success', {
                                position: toast.POSITION.TOP_RIGHT,
                            });
                            navigate('/Sell')
                        }
                    }).catch((err) => {
                        if (err.status === 500) {
                            toast.error('Failed', {
                                position: toast.POSITION.TOP_RIGHT,
                            });
                        }
                    })
            }
        }


    }

    const fileHandler = async (e) => {
        setImage(e.target.files[0]);
        const last_dot = e.target.files[0].name.lastIndexOf('.')
        const ext = e.target.files[0].name.slice(last_dot + 1)
        const name = e.target.files[0].name.slice(0, last_dot)


        if (file == null)
            return;

        console.log(file);
        toast(0, { autoClose: false, toastId: 1 })

        try {
            console.log("uploading")
            const storageRef = ref(Storage, `/courseImages/${e.target.files[0].name}`);
            const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
            console.log("uploaded");
            uploadTask.on('state_changed',
                (snapshot) => {
                    const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    toast.update(1, {
                        // position: toast.POSITION.TOP_CENTER,
                        render: 'Uploading ' + p.toFixed(0) + '%',
                    });
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setImageURL(url);
                        toast.update(1, {
                            type: toast.TYPE.SUCCESS,
                            render: 'File uploaded',
                            autoClose: 1000
                        });
                    });
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={styles.Main}>
            <div className={styles.imageContainer}>
                {/* <img src={user.img} /> */}

                <div className={styles.h1}><h1>Edit Item</h1></div>
                <div className={styles.joinss}>
                    <img style={{ width: '100px', height: '100px' }} src={imageURL === "" ? "https://www.bclplaw.com/a/web/300124/3WLK4W/gettyimages-871647852.jpg" : imageURL}></img>
                    <div className={styles.haha} >
                        <label for="files" >Choose Image</label>
                        <input accept=".png,.jpg,.jpeg,.jfif,.webp" onChange={fileHandler} id="files" style={{ visibility: "hidden" }} type="file" />
                    </div>
                </div>
            </div>

            <form className={styles.formContainer} ref={formRef} onSubmit={(e) => handleJob(e)}>

                <div className={styles.category}>

                    <label>Choose Category :</label>
                    <select defaultValue={category} onChange={(e) => setCategory(e.target.value)}>
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
                <TextField defaultValue={location.state.data.title} className={styles.input} required name='title' id="outlined-basic" label="T I T L E" size='small' variant="outlined" />
                <TextField className={styles.inputDescription} defaultValue={location.state.data.description} required name='description' multiline rows={9} id="outlined-basic" label="DESCRIPTION" size='small' type="number" variant="outlined" />
                <FormControl >
                    <InputLabel htmlFor="outlined-adornment-amount">Min Amount</InputLabel>
                    <OutlinedInput
                        id="outlined-basic"
                        // value={values.amount}
                        // onChange={handleChange('amount')}
                        className={styles.input}
                        startAdornment={<InputAdornment position="start">Rs</InputAdornment>}
                        label="Min Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                    />
                </FormControl>
                <Stack component="form" spacing={2}>
                    <TextField required id="datetime-local" defaultValue={location.state.data.startTime} label="Bid Start Time" type="datetime-local" size='small' value={startTime} onChange={(e) => setStartTime(e.target.value)} sx={{ width: 250 }} InputLabelProps={{ shrink: true, }} />
                    <TextField required id="datetime-local" label="Bid End Time" size='small' type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} sx={{ width: 250 }} InputLabelProps={{ shrink: true, }} />
                </Stack>
                <div className={styles.footer}>
                    <div>
                        <button type='submit'>Update</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Selledit