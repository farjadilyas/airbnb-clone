import React from 'react';

import { Typography } from '@material-ui/core'; 
import { ArrowForward } from '@material-ui/icons';
import { functions } from '../../../constants'; 

import useStyles from './styles';

const BookingData = ({ booking }) => {
    
    // Using styles
    const classes = useStyles();

    // Building Layout
    return (
        <div className={classes.bookingData}>
            <Typography variant="h6">
                {booking.hotel.name}
            </Typography>
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
                {functions.getDayDiff(booking.checkin, booking.checkout)} Day(s)
                </Typography>
            </div>
            <div className={classes.cardRow} style={{ justifyContent: 'space-evenly' }}>
                <Typography variant="h7" gutterBottom>
                    From {new Date(booking.checkin).toDateString()}
                </Typography>
                <ArrowForward />
                <Typography variant="h7" gutterBottom>
                    To {new Date(booking.checkout).toDateString()}
                </Typography>
            </div>
            <div className={classes.cardContent}>
                <Typography variant="h6" gutterBottom>Price</Typography>
                <Typography variant="h6">
                    ${booking.totalPrice.toFixed(2)}
                </Typography>
            </div>
        </div>
    );
}

export default BookingData;
