import React from 'react';
import Button from '@material-ui/core/Button';
import './start.styles.css';
import { useHistory } from 'react-router';

const Start = () => {

    const history = useHistory();

    const navigateTo = (path) => {
        history.push(path);
    }

    return(
        <div className='main'>
            <div className='main-body'>
                <img className='main-img' src='https://www.paidmembershipspro.com/wp-content/uploads/2016/09/Subscription-check-300x300.png' alt='logo' />
                <div className='main-text'>
                    <h1>Merequetengue</h1>
                    <p>
                        Administra tus suscripciones mensuales, toda la información en un mismo lugar
                    </p>
                </div>
            </div>
            <div className='main-btn'>
                <Button
                    color='primary'
                    className='btn' 
                    variant="contained"
                    onClick={() => navigateTo('/login')}
                >
                    Log In
                </Button>
                <Button 
                    className='btn' 
                    variant="outlined"
                    onClick={() => navigateTo('/register')}
                >
                    Sign Up
                </Button>
            </div>
        </div>
    );
}

export default Start;