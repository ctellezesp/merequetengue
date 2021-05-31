import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import swal from 'sweetalert';
import { useHistory } from 'react-router';
import { auth, firestore } from '../../firebase/firebase.utils';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    main: {
        marginTop: '10px',
        padding: '10px'
    }
}));

const UserSubscriptionsList = () => {

    const classes = useStyles();
    const history = useHistory();
    const [subscriptions, setSubscriptions] = useState([]);
    const [expenses, setExpenses] = useState(0);

    useEffect(() => {

        auth.onAuthStateChanged(user => {
            if (!user) {
                history.push('/login');
            }
            firestore.collection('user-subs').where('user', '==', user.uid).get()
                .then(res => {
                    if (!res.empty) {
                        const transform = transformData(res.docs);
                        setSubscriptions(transform);
                        calculateExpenses(transform);
                    }
                });


        });
    }, []);

    const calculateExpenses = (subs) => {
        let expenses = 0;
        for (let sub of subs) {
            console.log(sub);
            if (sub.period === 'week') {
                expenses += (+sub.price * 4);
            } else if (sub.period === 'biweek') {
                expenses += (+sub.price * 2);
            } else {
                expenses += (+sub.price);
            }
        }
        setExpenses(expenses);
    }

    const goToCreate = () => {
        history.push('/user/subscriptions/add');
    }

    const transformData = (data) => {
        const dataT = data.map(doc => {
            const id = doc.id;
            return {
                id,
                ...doc.data()
            }
        })
        return dataT;
    }

    const goToEdit = (id) => {
        history.push(`/user/subscriptions/edit/${id}`);
    }

    const deleteSubscription = (id) => {
        swal({
            title: "Do you want to delete this subscription?",
            text: "Once deleted, you will not be able to recover it!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    firestore.collection('user-subs').doc(id).delete();
                    const filtered = subscriptions.filter(sub => sub.id !== id);
                    setSubscriptions(filtered);
                    calculateExpenses(filtered);
                    swal("Subscription Deleted", {
                        icon: "success",
                    });
                } else {
                    swal("Your subscription is safe!");
                }
            });
    }

    const logout = () => {
        auth.signOut().then(() => history.push('/'));
    }

    return (
        <div>
            <Grid container className={classes.main} justify="start" alignItems="start" spacing={2}>
                <Grid item xs={12} lg={9}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.button}
                        startIcon={<AddIcon />}
                        onClick={goToCreate}
                    >
                        Add Subscription
                    </Button>
                    <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                        {subscriptions.length > 0 && subscriptions.map((sub, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Card className={classes.root}>
                                    <div className={classes.details}>
                                        <CardContent className={classes.content}>
                                            <Typography component="h5" variant="h5">
                                                {sub.subscription.name}
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                ${sub.price}
                                            </Typography>
                                            <Typography style={{ textTransform: 'capitalize' }} variant="subtitle1" color="inherit">
                                                {sub.period}
                                            </Typography>
                                            <IconButton aria-label="edit" onClick={() => goToEdit(sub.id)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete" onClick={() => deleteSubscription(sub.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </CardContent>
                                    </div>
                                    <CardMedia
                                        className={classes.cover}
                                        image={sub.subscription.imageUrl}
                                        title="Live from space album cover"
                                    />
                                </Card>
                            </Grid>
                        ))}
                        {subscriptions.length === 0 &&
                            <p>No subscriptions found</p>
                        }
                    </Grid>
                </Grid>
                <Grid xs={12} lg={3}>
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography variant="h5" component="h5">
                                Your Expenses per month:
                            </Typography>
                            <Typography variant="body2" component="p">
                                ${expenses}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Fab
                size="small"
                color="secondary"
                aria-label="logout"
                style={{ position: 'fixed', bottom: '10px', right: '10px' }}
                onClick={logout}
            >
                <ExitToAppIcon />
            </Fab>
        </div>
    );
}

export default UserSubscriptionsList;