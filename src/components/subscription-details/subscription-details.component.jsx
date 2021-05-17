import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { firestore } from '../../firebase/firebase.utils';
import swal from 'sweetalert';
import './subscription-details.styles.css';
import { useHistory } from 'react-router';

const SubscriptionDetails = (props) => {

    const history = useHistory();

    const initialState = {
        'name': '',
        'imageUrl': ''
    }

    const [subscription, setSubscription] = useState(initialState);
    const [edit, setEdit] = useState(false);

    useEffect(() => {

        const obtainSubscription = async (id) => {
            const result = await firestore.collection('subscriptions').doc(id).get();
            return result;
        }

        if (props.match.params.id) {
            setEdit(true);
            obtainSubscription(props.match.params.id)
                .then(res => {
                    setSubscription(res.data());
                });
        }
    }, [edit]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSubscription({
            ...subscription,
            [name]: value
        });
    }

    const addToCollection = async () => {
        const onSave = await firestore.collection('subscriptions').add(subscription);
        return onSave;
    }

    const editData = async (id) => {
        const toEdit = await firestore.collection('subscriptions').doc(id).set(subscription);
        return toEdit;
    }

    const save = async () => {
        try {
            if (edit) {
                const itemEdit = editData(props.match.params.id);
                console.log(itemEdit);
                swal('Subscription edited', `${subscription.name} has been edited`, 'success')
                    .then(() => {
                        history.push('/subscriptions');
                    });
            } else {
                const item = addToCollection();
                console.log(item);
                swal('Subscription added', `${subscription.name} has been added`, 'success')
                    .then(() => {
                        history.push('/subscriptions');
                    });
            }
        } catch (error) {
            console.log('ERROR: ', error);
            swal('Something wrong', `${error.message}`, error);
        }
    }

    const { name, imageUrl } = subscription;

    return (
        <div>
            <Grid className='main-subscription' container>
                <Grid item xs={12} lg={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={8}>
                            <Paper className='form-section' elevation={1}>
                                <h1>{edit ? 'Edit Subscription' : 'Add Subscription'}</h1>
                                <TextField
                                    id="outlined-basic"
                                    name="name"
                                    label="Name"
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => handleChange(e)}
                                />
                                <TextField
                                    id="outlined-basic"
                                    label="URL Image"
                                    variant="outlined"
                                    name="imageUrl"
                                    value={imageUrl}
                                    onChange={(e) => handleChange(e)}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={save}
                                    disabled={name === '' || imageUrl === ''}
                                >
                                    {edit ? 'Edit' : 'Add'}
                                </Button>
                            </Paper>

                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Paper className='subscription-img-section' elevation={1}>
                                <img
                                    src={imageUrl}
                                    className='subscription-img'
                                    alt={name}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default SubscriptionDetails;