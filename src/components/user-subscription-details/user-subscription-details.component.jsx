import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Fab from '@material-ui/core/Fab';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { auth, firestore } from '../../firebase/firebase.utils';
import { useHistory } from 'react-router';
import swal from 'sweetalert';

const UserSubscriptionsDetails = (props) => {

    const history = useHistory();

    const initialState = {
        subscription: '',
        user: '',
        price: 0,
        period: ''
    }

    const [subData, setSubData] = useState(initialState);
    const [subscriptions, setSubscriptions] = useState([]);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        if (props.match.path.includes('edit')) {
            setEdit(true);
            firestore.collection('user-subs').doc(props.match.params.id).get()
                .then(res => {
                    console.log(res.data());
                    setSubData(res.data());
                });
        }
        auth.onAuthStateChanged(user => {
            if (!user) {
                history.push('/login');
            } else {
                setSubData({
                    ...subData,
                    user: user.uid
                });
            }
        });


        firestore.collection('subscriptions').orderBy('name', 'desc').get()
            .then(res => {
                const transform = res.docs.map(doc => {
                    return {
                        id: doc.id,
                        ...doc.data()
                    }
                });
                setSubscriptions(transform);
            });
    }, []);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setSubData({
            ...subData,
            [name]: value
        });
    }

    const save = () => {
        try {
            if (edit) {
                firestore.collection('user-subs').doc(props.match.params.id).set(subData);
                swal('Edited', 'Subscription edited', 'success')
                    .then(() => {
                        history.push('/user/subscriptions/list');
                    });
            } else {
                firestore.collection('user-subs').add(subData);
                swal('Added', 'Subscription added', 'success')
                    .then(() => {
                        history.push('/user/subscriptions/list');
                    });
            }
        } catch (error) {
            swal('Error', `${error.message}`, 'error');
        }
    }

    const goHome = () => {
        history.push('/user/subscriptions/list');
    }

    const logout = () => {
        auth.signOut().then(() => history.push('/'));
    }

    const { subscription, price, period } = subData;

    return (
        <div className='login-main'>
            <Paper className='login-body' elevation={0}>
                <div className='inner-body'>
                    <h1>{edit ? `Edit subscription: ${subscription.name}` : 'Add Subscription'}</h1>
                    {!edit &&
                        <FormControl variant="outlined" className='full-width'>
                            <InputLabel id="demo-simple-select-outlined-label">Subscription</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                onChange={handleChange}
                                label="Selecy Subscription"
                                name="subscription"
                            >
                                {subscriptions.map((sub, index) => (<MenuItem key={index} value={sub}>{sub.name}</MenuItem>))}
                            </Select>
                        </FormControl>
                    }
                    <TextField
                        fullWidth
                        className='custom-input'
                        id="outlined-basic"
                        label="Price"
                        variant="outlined"
                        name='price'
                        type='number'
                        value={price}
                        onChange={e => handleChange(e)}
                    />
                    <FormControl variant="outlined" className='full-width'>
                        <InputLabel id="demo-simple-select-outlined-label">Pay every</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            onChange={handleChange}
                            label="Selecy Subscription"
                            name='period'
                            value={period}
                        >
                            <MenuItem value="week">Week</MenuItem>
                            <MenuItem value="biweek">15 days</MenuItem>
                            <MenuItem value="month">Month</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={save}
                        disabled={subscription === '' || price === 0 || period === ''}
                    >
                        {edit ? 'Edit' : 'Save'} Subscription
                    </Button>
                </div>
            </Paper>
            <Fab
                size="small"
                color="secondary"
                aria-label="logout"
                style={{ position: 'fixed', top: '10px', right: '10px' }}
                onClick={logout}
            >
                <ExitToAppIcon />
            </Fab>
            <Fab
                size="small"
                color="primary"
                aria-label="add"
                style={{ position: 'fixed', bottom: '10px', right: '10px' }}
                onClick={goHome}
            >
                <HomeIcon />
            </Fab>
        </div>
    );
}

export default UserSubscriptionsDetails;