import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { auth } from '../../firebase/firebase.utils';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';

const RecoverPassword = () => {

    const history = useHistory();

    const [email, setEmail] = useState('initialState');

    const handleChange = (event) => {
        setEmail(event.target.value);
    }

    const resetPassword = () => {
        try {
            const res = auth.sendPasswordResetEmail(email);
            swal('Password Recovery Started', 'Please, follow the instructions in your email', 'success')
                .then(() => {
                    history.push('/login');
                });
        } catch (error) {
            console.log(error);
            swal('Error', `${error.message}`, 'error');
        }
    }

    return (
        <div className='login-main'>
            <Paper className='login-body' elevation={0}>
                <div className='inner-body'>
                    <h2 className='title'>Recover Password</h2>
                    <TextField
                        fullWidth
                        className='custom-input'
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        name='email'
                        onChange={e => handleChange(e)}
                    />
                </div>
                <div className='login-btn'>
                    <Button
                        className='btn'
                        variant="contained"
                        color="primary"
                        onClick={resetPassword}
                        disabled={email === ''}
                    >
                        Recover Password
                    </Button>
                    <p>Don't you have an account? <Link to='/register'>Register here</Link></p>
                </div>
            </Paper>
        </div>
    );
}

export default RecoverPassword;