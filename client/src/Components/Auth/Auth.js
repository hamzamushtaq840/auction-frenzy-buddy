import React, { useState } from 'react'
import './Auth.css'
import three from './../../Assets/03.svg'
import six from './../../Assets/06.svg'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios'
import { useDispatch } from "react-redux";
import { userActions } from "./../Redux/user-slice"
import { useNavigate } from 'react-router-dom';
import logo from './../../Assets/logo.png'


function Auth() {
    const [change, setChange] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //FOR LOGIN
    const [inputs, setInputs] = useState({
        username: '',
        password: '',
    });
    const handleChange = e => {
        const { name, value } = e.target;
        setInputs(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleLogin = (e) => {
        e.preventDefault()
        console.log(inputs)
        let data = {
            email: inputs.username,
            password: inputs.password,
        };
        axios
            .post("http://localhost:5000/api/login", data)

            .then(function (response) {
                let obj = response.data.user;
                obj.token = response.data.token;
                console.log(obj);
                if (obj.emailverified === 0) {
                    toast.error("Verify your Email First", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                else {
                    if (obj.role === 'admin') {
                        dispatch(userActions.userInfo(obj));
                        navigate('/AdminDashboard')
                    }
                    if (obj.role === 'user') {
                        dispatch(userActions.userInfo(obj));
                        navigate('/UserDashboard')
                    }
                }


                // navigate(from, { replace: true });
            })
            .catch(function (error) {
                if (error?.response?.request?.status === 400) {
                    toast.error("Wrong Combination", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                if (error?.response?.request?.status === 403) {
                    toast.error("Wrong Combination", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            });
    }

    //FOR SIGNUP

    const MailService = async (data) => {
        console.log("IN MAILSERVICE FUNCTION");
        data.link = 'http://localhost:3000/emailVerification/' + data.id;
        data.from_name = 'Online Auction System'
        emailjs
            .send('service_vimsp8b', 'template_mkl0oq6', data, '_skPtTuhpdi0bie5x')
            .then(
                (result) => {
                    console.log(result.text);
                    toast.success('Success', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                },
                (error) => {
                    console.log(error.text);
                }
            );

    };

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmpassword: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
            email: Yup.string()
                .required('Valid email required')
                .email('Valid email required'),
            password: Yup.string().required('Password is required'),
            confirmpassword: Yup.string().required('Confirm Password is required').oneOf(
                [Yup.ref('password'), null],
                'Passwords must match'
            ),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log(values)

            axios.post('http://localhost:5000/api/signup', {
                name: values.username,
                email: values.email,
                password: values.password,
                role: 'user',
            },)
                .then(function (response) {
                    console.log(response);
                    if (response?.status === 200) {
                        console.log(response.data)
                        MailService(response.data);
                        toast.success('Check your Email to verify', {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        setChange(false);
                    } else if (response?.response?.status === 400) {
                        toast.error('Account with this email already exists', {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    if (error.response.status === 400) {
                        toast.error('Account with this email already exists', {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    } else if (error.response.status === 500) {
                        toast.error('Error Registering User', {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    }
                });
        },
    });

    return (
        <div className='body'>
            <div class={change ? "container sign-up-mode" : "container"}>
                <div class="forms">
                    <div class="signin-signup">
                        <form onSubmit={handleLogin} class="form sign-in-form">
                            <h2 class="title">Login</h2>
                            <div class="input-field">
                                <i class="fas fa-user"></i>
                                <input onChange={handleChange} name='username' value={inputs.username} type="email" required placeholder="Email" />
                            </div>
                            <div class="input-field">
                                <i class="fas fa-lock"></i>
                                <input onChange={handleChange} name='password' value={inputs.password} type="password" required placeholder="Password" />
                            </div>
                            <button type="submit" class="btn solid">Login</button>

                        </form>
                        <form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit() }} class="form sign-up-form">
                            <h2 class="title" >Register</h2>
                            <div class="input-field">
                                <i class="fas fa-user"></i>
                                <input type="text"
                                    id="username"
                                    placeholder="Full Name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.username} />
                            </div>
                            {formik.touched.username && formik.errors.username ? (
                                <p className="error" >{formik.errors.username}</p>
                            ) : null}
                            <div class="input-field">
                                <i class="fas fa-envelope"></i>
                                <input type="email"
                                    id="email"
                                    placeholder="Email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email} />
                            </div>
                            {formik.touched.email && formik.errors.email ? (
                                <p className="error" >{formik.errors.email}</p>
                            ) : null}
                            <div class="input-field">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="password"
                                    placeholder="Password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password} />
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <p className="error" >{formik.errors.password}</p>
                            ) : null}
                            <div class="input-field">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="confirmpassword"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirmpassword}
                                    placeholder="Confirm password" />
                            </div>
                            {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
                                <p className="error" >{formik.errors.confirmpassword}</p>
                            ) : null}


                            <button type="submit" class="btn" >Sign Up</button>

                        </form>
                    </div>
                </div>

                <div class="panels-container">
                    <div class="panel left-panel">
                        <div class="content">
                            <h3>Online Auction System</h3>
                            <p></p>
                            <button class="btn transparent" id="sign-up-btn" onClick={() => setChange(true)} >Register</button>
                        </div>
                        <img src={logo} class="image" alt="girl phone" />
                    </div>
                    <div class="panel right-panel">
                        <div class="content">
                            <h3>Online Auction System</h3>
                            <p></p>
                            <button class="btn transparent" id="sign-in-btn" onClick={() => setChange(false)}>Login</button>
                        </div>
                        <img src={logo} class="image" alt="girl sofa" />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Auth