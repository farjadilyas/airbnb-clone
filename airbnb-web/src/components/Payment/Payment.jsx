import React, { useState } from 'react'
import { Grid, CircularProgress, Card, CardContent, Typography, Button } from "@material-ui/core";
import { CheckCircle } from '@material-ui/icons';
import useStyles from './styles';

import BookingData from './BookingData/BookingData';
import PaymentForm from './PaymentForm/PaymentForm';

import { Link } from 'react-router-dom';

const Payment = ({ booking, loadBookings }) => {

    // Using styles
    const classes = useStyles();

    const [success, setSuccess] = useState(false);

    // Payment Card
    const PaymentCard = () => (
        <>
            <div className={classes.cardContent}>
                <Typography variant="h4" gutterBottom>Payment Checkout</Typography>
            </div>
            <Typography variant="h5" color="textPrimary">Booking Summary</Typography>
            { 
                booking ? 
                <BookingData booking={booking} />
                : (
                    <div className={classes.loading}>
                        <CircularProgress size={50}/>
                    </div>
                )
            }
            <PaymentForm booking={booking} setSuccess={setSuccess}/>
        </>
    );

    // Booking Success Subcomponent
    const BookingSuccess = () => (
        <div className={classes.successCard}>
            <Typography variant="h4">Success!</Typography>
            <CheckCircle color="secondary" style={{ fontSize: 100 }}/>
            <Button variant="contained" component={Link} to="/bookings" color="secondary" onClick={loadBookings}>
                View Booking
            </Button>
        </div>
    );

    // Building Layout
    return (
        <main className={classes.content}>
            <div className={classes.toolbar}/>
            <Grid container justify="center" spacing={4}>
                <Grid item xs={12} sm={6} ms={6} lg={6}>
                    <Card className={classes.root}>
                        <CardContent>
                            {
                                success 
                                ? <BookingSuccess />
                                : <PaymentCard />
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </main>
    )
}

export default Payment
