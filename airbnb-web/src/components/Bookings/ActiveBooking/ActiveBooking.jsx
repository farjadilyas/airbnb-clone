import React from 'react';
import { useDispatch } from 'react-redux';

import { Card, CardMedia, CardContent, Typography, Avatar, Divider, Button } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';

import { Link } from 'react-router-dom';

import { images } from '../../../constants';
import { functions } from '../../../constants';
import { checkInHotel, checkOutHotel } from '../../../actions/booking';
 
import useStyles from './styles';

const ActiveBooking = ({ booking }) => {

    // Using Styles
    const classes = useStyles();

    // Using Dispatch
    const dispatch = useDispatch();

    // Constants for table building
    const avatars = [images.adultIcon, images.kidsIcon, images.infantIcon, images.petIcon];
    const guests = ["Adults", "Children", "Infants", "Pets"];
    const guestKeys = ["adults", "children", "infants", "pets"];

    // Function for Check-In or Check-Out
    const handleButtonPress = () => {
        if (booking.status === 'CREATED') {
            dispatch(checkInHotel(booking._id));
        } else {
            dispatch(checkOutHotel(booking._id));
        }
    }

    // Building Layout
    return (
        <Card className={classes.root}>
            <CardMedia className={classes.media} image={booking.hotel.img} title={booking.name} />
            <CardContent>
                <div className={classes.cardContent}>
                    <Typography variant="h4" gutterBottom>
                        {booking.hotel.name}
                    </Typography>
                    <Typography variant="h6">
                        {booking.hotel.ratings} ★
                    </Typography>
                </div>
                <div className={classes.cardRow} >
                    <Avatar className={classes.purple} alt={booking.host.firstName + " " + booking.host.lastName} src={booking.host.imageUrl}>
                        {booking.host.firstName.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" color="textSecondary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                        {booking.host.firstName + ' ' + booking.host.lastName}
                    </Typography>
                </div>
                <div className={classes.cardRow} style={{ justifyContent: 'space-evenly' }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                        {booking.hotel.beds} beds
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                        ${booking.hotel.price}/night
                    </Typography>
                </div>
                <Divider style={{ marginTop: "25px", marginBottom: "25px" }}/>
                <div className={classes.cardRow} style={{ justifyContent: 'space-evenly' }}>
                    <Typography variant="h5" color="textSecondary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                        Your Booking
                    </Typography>
                </div>
                <div className={classes.cardContent}>
                    <Typography variant="h6" gutterBottom>Beds</Typography>
                    <Typography variant="h6">
                        {booking.numGuests.adults}/{booking.hotel.beds}
                    </Typography>
                </div>
                <Typography variant="h6" gutterBottom>Guests</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {
                                guestKeys.map((key, index) => (
                                    <TableRow>
                                        <TableCell>
                                            <Avatar className={classes.purple} alt={booking.host.firstName + " " + booking.host.lastName} src={avatars[index]}>
                                                {booking.host.firstName.charAt(0)}
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h7" color="textSecondary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                                                {booking.numGuests[key]} 
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h7" color="textSecondary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                                                {guests[index]}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>Duration</Typography>
                <div className={classes.cardRow} style={{ justifyContent: 'space-evenly' }}>
                    <Typography variant="h6" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                        {functions.getDayDiff(booking.checkIn, booking.checkOut)} Days
                    </Typography>
                </div>
                <div className={classes.cardRow} style={{ justifyContent: 'space-evenly' }}>
                    <Typography variant="h6" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                        From {new Date(booking.checkIn).toDateString()}
                    </Typography>
                    <ArrowForward />
                    <Typography variant="h6" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                        To {new Date(booking.checkOut).toDateString()}
                    </Typography>
                </div>
                <Divider style={{ marginTop: "25px", marginBottom: "25px" }}/>
                <div className={classes.cardContent}>
                    <Typography variant="h5" gutterBottom>Price</Typography>
                    <Typography variant="h5">
                        ${booking.totalPrice}.00
                    </Typography>
                </div>
                <div style={{ marginTop: "25px", display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="secondary" onClick={handleButtonPress} component={Link} to="/bookings">
                        {booking.status === 'CREATED' ? 'CheckIn' : 'CheckOut'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
};

export default ActiveBooking;
