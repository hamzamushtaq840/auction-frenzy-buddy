import { TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './Profile.module.css';
import { Storage } from "../../Utils/firebase";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage"

function Profile() {
    const user = useSelector((state) => state.user.userInfo);
    const formRef = useRef();
    const [users, setUsers] = useState({})
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [licenseNumber, setLicenseNumber] = useState('');
    const [panNumber, setPanNumber] = useState('')
    const [imageURL, setImageURL] = useState('');
    const [image, setImage] = useState('');
    const [file, setfile] = useState('');
    const [trigger, setTrigger] = useState(false)


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

    useEffect(() => {

        axios.get("http://localhost:5000/api/getUser/" + user.id, { withCredentials: true })
            .then((res) => {
                console.log(res.data.data[0]);
                setUsers(res.data.data[0])
                setName(res.data.data[0].name)
                setEmail(res.data.data[0].email)
                setLicenseNumber(res.data.data[0].licenseNumber)
                setPanNumber(res.data.data[0].panNumber)
                setImageURL(res.data.data[0].userImg)
            }).catch((err) => {
                console.log(err)
            })

    }, [trigger])


    const handleJob = (e) => {
        e.preventDefault();
        if (
            users.name === name
            && (users.licenseNumber === licenseNumber || users.licenseNumber === undefined && licenseNumber === "" || users.licenseNumber === undefined && licenseNumber === null || users.licenseNumber === null && licenseNumber === "")
            && (users.panNumber === panNumber || users.panNumber === undefined && panNumber === "" || users.panNumber === undefined && panNumber === null || users.panNumber === null && panNumber === "")
            && (imageURL === null && users.imgURL === undefined)
        ) {

            toast.error('Nothing to update', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        else {
            let data = {
                id: user.id,
                name: name,
                img: imageURL,
                licenseNumber: licenseNumber,
                panNumber: panNumber,
            }
            if (imageURL === '' && users.imgURL === null) {
                data.img = null
            }

            axios.post("http://localhost:5000/api/updateUserProfile", data, { withCredentials: true })
                .then((res) => {
                    console.log(res);
                    if (res.status === 200) {
                        toast.success('Profile Updated', {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        setTrigger(state => !state)
                    }
                }).catch((err) => {
                    console.log(err)
                })
        }

    };


    const handleApproval = () => {
        let data = {
            id: user.id,
            name: name,
            img: imageURL
        }
        console.log(panNumber);
        if (licenseNumber === null) {
            toast.error('Add LicenseNumber', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        else if (panNumber === null) {
            toast.error('Add PanNumber', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        else {


            axios.post("http://localhost:5000/api/requestApproval", data, { withCredentials: true })
                .then((res) => {
                    console.log(res);
                    if (res.status === 200) {
                        toast.success('Approved request sent', {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        // setTrigger(state => !state)
                    }
                }).catch((err) => {
                    console.log();
                    if (err.response.request.status === 400) {
                        toast.error('You have already requested for approval', {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    }
                    else {
                        console.log(err)
                    }
                })
        }
    }

    return (
        <div className={styles.Main}>
            <div className={styles.abc}>

                <div className={styles.imageContainer}>
                    {/* <img src={user.img} /> */}
                    <div className={styles.joinss}>
                        <img src={imageURL === "" || imageURL === null ? "http://www.clker.com/cliparts/f/a/0/c/1434020125875430376profile.png" : imageURL}></img>
                        <div className={styles.haha} >
                            <label for="files" class="btn33">Change Image</label>
                            <input accept=".png,.jpg,.jpeg,.jfif" onChange={fileHandler} id="files" style={{ visibility: "hidden" }} type="file" />
                        </div>
                    </div>
                </div>

                <div className={styles.formmm}>
                    <h1>USER DETAILS</h1>
                    <form
                        ref={formRef}
                        onSubmit={(e) => handleJob(e)}
                        style={{
                            display: 'flex',
                            gap: '20px',
                            flexDirection: 'column',
                            // marginTop: '20px',
                        }}
                        className={styles.formContainer}
                    >
                        <TextField
                            className={styles.input}
                            id="standard-helperText"
                            label="User Name"
                            value={name}
                            helperText="This name will be shown for jobs application"
                            variant="standard"
                            name="title"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <TextField
                            className={styles.input}
                            disabled
                            id="standard-disabled"
                            label="Disabled"
                            value={email}
                            variant="standard"
                        />
                        <TextField
                            className={styles.input}
                            id="standard-helperText"
                            label="AGE"
                            value={licenseNumber}
                            variant="outlined"
                            name="License"
                            type="number"
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            required
                        />

                        <TextField
                            className={styles.input}
                            id="standard-helperText"
                            label="Phone Number"
                            value={panNumber}
                            variant="outlined"
                            name="title"
                            type="number"
                            onChange={(e) => setPanNumber(e.target.value)}
                            required
                        />

                    </form>
                </div>
            </div>
            <div className={styles.footer}>
                <button onClick={handleJob} type="submit">Update</button>
                {/* {users.authorized === 0 && <button onClick={handleApproval}>Request Approval</button>} */}
            </div>

        </div >
    );
}

export default Profile;
