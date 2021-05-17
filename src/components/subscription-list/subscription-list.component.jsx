import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { firestore } from '../../firebase/firebase.utils';
import swal from 'sweetalert';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
    table: {
        width: '100%',
    },
    button: {
        margin: theme.spacing(1),
    },
    main: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10px'
    },
    danger: {
        color: 'red'
    }
}));


const SubscriptionList = () => {

    const classes = useStyles();

    const history = useHistory();

    const [subscriptions, setSubscriptions] = useState([]);


    useEffect(() => {
        firestore.collection('subscriptions').orderBy('name', 'asc').get()
            .then(res => {
                const transformedData = res.docs.map(item => {
                    return {
                        id: item.id,
                        ...item.data()
                    }
                });
                setSubscriptions(transformedData);
            });
    }, []);

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
                    firestore.collection('subscriptions').doc(id).delete();
                    const filterAfterDeleted = subscriptions.filter(subs => subs.id !== id);
                    setSubscriptions(filterAfterDeleted);
                    swal("Subscription delete", {
                        icon: "success",
                    });
                } else {
                    swal("Subscription NOT Deleted");
                }
            });
    }

    const goToEdit = (id) => {
        history.push(`/subscriptions/edit/${id}`);
    }

    const goToCreate = () => {
        history.push('/subscriptions/add');
    }

    return (
        <div>
            <Grid container className={classes.main}>
                <Grid item xs={12} lg={8}>
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
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subscriptions.map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton aria-label="edit" onClick={() => goToEdit(row.id)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete" onClick={() => deleteSubscription(row.id)}>
                                                <DeleteIcon className={classes.danger} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    );
}

export default SubscriptionList;