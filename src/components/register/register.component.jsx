import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {auth, firestore, signInWithGoogle} from '../../firebase/firebase.utils';
import { useHistory } from 'react-router';
import swal from 'sweetalert';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from 'react-router-dom';
import './register.styles.css';

const Register = () => {

    const history = useHistory();

    const initialState = {
        name: '',
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

    const register = async (email, name, id) => {
        try {
            const res = await firestore.collection('users').doc(id).set({email, name});
            return res;
        }
        catch(error) {
            console.log('ERROR: ', error);
            swal('Error', error.message, 'error');
        }
    }

    const registerWithData = async () => {
        try {
            const {name, email, password} = user; 
            const userSave = await auth.createUserWithEmailAndPassword(email, password);
            const data = await register(email, name, userSave.user.uid);
            console.log(data);
            swal('Usuario Registrado', `${email} ha sido registrado`, 'success').then(() => {
                history.push('/');
            });
        } catch (error) {
            console.log('ERROR: ', error);
            swal('Error', error.message, 'error');
        }
    }

    const registerWithGoogle = async() => {
        try {
            const userSave = await signInWithGoogle();
            console.log(userSave);
            const {uid, displayName, email} = userSave.user;
            const data = await register(email, displayName, uid);
            console.log(data);
            swal('Usuario Registrado', `${email} ha sido registrado`, 'success').then(() => {
                history.push('/');
            });
        } catch(error) {
            console.log('ERROR: ', error);
            swal('Error', error.message, 'error');
        }
    }

    

    return(
        <div className='register-main'>
            <Paper className='paper-register' elevation={2}>
                <div className='register-body'>
                    <h2>Register</h2>
                    <TextField 
                        fullWidth
                        className='custom-input'
                        id="outlined-basic" 
                        label="Name" 
                        variant="outlined" 
                        name='name'
                        onChange={e => handleChange(e)} 
                    />
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
                <div className='register-btn'>
                    <Button
                        className='btn' 
                        variant="contained"
                        color="primary"
                        onClick={registerWithData}
                        disabled={user.name === '' || user.email === '' || user.password === ''}
                    >
                        Register
                    </Button>
                    <Button 
                        className='btn' 
                        variant="outlined"
                        onClick={registerWithGoogle}
                    >
                        Register with Google
                    </Button>
                    <p>Do you already have an account? <Link to='/login'>Login here</Link></p>
                </div>
            </Paper>
        </div>
    );
}

export default Register;