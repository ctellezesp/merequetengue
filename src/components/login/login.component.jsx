import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { auth, signInWithGoogle } from '../../firebase/firebase.utils';
import swal from 'sweetalert';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link, useHistory } from 'react-router-dom';
import './login.styles.css';

const Login = () => {

    const history = useHistory();

    const initialState = {
        email: '',
        password: ''
    }

    const [user, setUser] = useState(initialState);
    const [show, setShow] = useState(false);

    const handleChange = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value
        });
    }

    const loginWithData = async () => {
        const { email, password } = user;
        try {
            const userLogin = await auth.signInWithEmailAndPassword(email, password);
            console.log(userLogin);
            swal('Login realizado', `${email} ha ingresado`, 'success').then(() => history.push('/user/subscriptions/list'));
        } catch (error) {
            console.log('ERROR: ', error);
            swal('Error', `${error.message}`, 'error');
        }
    }

    const loginWithGoogle = async () => {
        try {
            const userLogin = await signInWithGoogle();
            console.log(userLogin);
            swal('Login realizado', `${userLogin.user.email} ha ingresado`, 'success').then(() => history.push('/user/subscriptions/list'));
        } catch (error) {
            console.log('ERROR: ', error);
            swal('Error', `${error.message}`, 'error');
        }
    }

    return (
        <div className='login-main'>
            <Paper className='login-body' elevation={0}>
                <div className='inner-body'>
                    <h2 className='title'>Login</h2>
                    <TextField
                        fullWidth
                        className='custom-input'
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        name='email'
                        onChange={e => handleChange(e)}
                    />
                    <TextField
                        fullWidth
                        className='custom-input'
                        id="outlined-password-input"
                        label="Password"
                        type={show ? 'text' : 'password'}
                        autoComplete="current-password"
                        variant="outlined"
                        name='password'
                        onChange={e => handleChange(e)}
                    />
                    <FormControlLabel
                        control={<Checkbox icon={<VisibilityIcon />} checkedIcon={<VisibilityOffIcon />} name="checkedH" />}
                        onClick={() => setShow(!show)}
                        label={show ? 'Hide' : 'Show'}
                    />
                </div>
                <div className='login-btn'>
                    <Button
                        className='btn'
                        variant="contained"
                        color="primary"
                        onClick={loginWithData}
                        disabled={user.email === '' || user.password === ''}
                    >
                        Login
                    </Button>
                    <Button className='btn' variant="outlined" onClick={loginWithGoogle}>Login with Google</Button>
                    <p>Don't you have an account? <Link to='/register'>Register here</Link></p>
                    <span>Don't you remember your password? <Link to='/recover-password'>Recover Password here</Link></span>
                </div>
            </Paper>
        </div>
    );
}

export default Login;