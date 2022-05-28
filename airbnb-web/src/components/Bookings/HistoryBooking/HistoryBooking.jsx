import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import useStyles from './styles';
import { functions } from '../../../constants'; 

const HistoryBooking = ({ booking }) => {

    // Using Styles
    const classes = useStyles();

    // Building Layout
    return (
        <Card className={classes.root}>
            <CardMedia className={classes.media} image={booking.hotel.img} title={booking.name} />
            <CardContent>
                <div className={classes.cardContent}>
                    <Typography variant="h5" gutterBottom>
                        {booking.hotel.name}
                    </Typography>
                </div>
                <div className={classes.cardContent}>
                    <Typography variant="h7" gutterBottom>Beds</Typography>
                    <Typography variant="h7">
                        {booking.numGuests.adults}/{booking.hotel.beds}
                    </Typography>
                </div>
                <div className={classes.cardContent}>
                    <Typography variant="h7" gutterBottom>Guests</Typography>
                    <Typography variant="h7">
                        {booking.numGuests.adults + booking.numGuests.children + booking.numGuests.infants + booking.numGuests.pets }
                    </Typography>
                </div>
                <div className={classes.cardContent}>
                    <Typography variant="h7" gutterBottom>Duration</Typography>
                    <Typography variant="h7">
                    {functions.getDayDiff(booking.checkIn, booking.checkOut)} Days
                    </Typography>
                </div>
                <div className={classes.cardRow} style={{ justifyContent: 'space-evenly' }}>
                    <Typography variant="h7" gutterBottom>
                        From {new Date(booking.checkIn).toDateString()}
                    </Typography>
                    <ArrowForward />
                    <Typography variant="h7" gutterBottom>
                        To {new Date(booking.checkOut).toDateString()}
                    </Typography>
                </div>
                <div className={classes.cardContent}>
                    <Typography variant="h6" gutterBottom>Price</Typography>
                    <Typography variant="h6">
                        ${booking.totalPrice}.00
                    </Typography>
                </div>
            </CardContent>
        </Card>
    )
};

export default HistoryBooking;
