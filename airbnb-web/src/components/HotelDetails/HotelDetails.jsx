import React, { useState } from 'react';

import { Card, CardMedia, CardContent, Typography, Avatar } from '@material-ui/core';
import { Divider, Grid, IconButton, Button, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom'; 
import { ArrowLeft, ArrowRight } from '@material-ui/icons';

import Location from './Location/Location';
import BookingForm from './BookingForm/BookingForm';

import useStyles from './styles';

const HotelDetails = ({ hotel, user, setBooking }) => {

    // Using Styles
    const classes = useStyles();

    // State vars
    const [currentImage, setCurrentImage] = useState(0);

    // Image Control functions
    const nextImage = () => {
        setCurrentImage((currentImage + 1) % hotel.images.length);
    };

    const previousImage = () => {
        var prev = currentImage - 1 >= 0 ? currentImage - 1 : hotel.images.length - 1;
        setCurrentImage(prev);
    };

    // Loading
    if (!hotel) {
        return (
            <>
                <div className={classes.toolbar} />
                <div className={classes.loading}>
                    <CircularProgress size={80}/>
                </div>
            </>
        )
    }

    // Building Layout
    return (
        <main className={classes.content}>
            <div className={classes.toolbar}/>
            <Grid container justify="center" spacing={4}>
                <Grid item key={hotel.id} xs={10} sm={10} ms={10} lg={10}>
                    <Card className={classes.root}>
                        <CardMedia className={classes.media} image={hotel.images[currentImage]} title={hotel.name} />
                        <div className={classes.imageControl}>
                            <IconButton onClick={previousImage}>
                                <ArrowLeft/>
                            </IconButton>
                            <IconButton>
                                <ArrowRight onClick={nextImage}/>
                            </IconButton>
                        </div>
                        <CardContent>
                            <div className={classes.cardContent}>
                                <Typography variant="h4" gutterBottom>
                                    {hotel.name}
                                </Typography>
                                <Typography variant="h6">
                                    {hotel.ratings} ★
                                </Typography>
                            </div>
                            <div className={classes.cardRow} >
                                <Avatar className={classes.purple} alt={hotel.host.firstName + " " + hotel.host.lastName} src={hotel.host.imageUrl}>
                                    {hotel.host.firstName.charAt(0)}
                                </Avatar>
                                <Typography variant="h6" color="textSecondary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                                    {hotel.host.firstName + ' ' + hotel.host.lastName}
                                </Typography>
                            </div>
                            <div className={classes.cardRow} style={{ justifyContent: 'space-evenly' }}>
                                <Typography variant="h6" color="textSecondary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                                    {hotel.beds} beds
                                </Typography>
                                <Typography variant="h6" color="textSecondary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                                    ${hotel.price}/night
                                </Typography>
                            </div>
                            <Divider className={classes.divider}/>
                            <Typography variant="body1">
                                {hotel.description}
                            </Typography>
                            <Divider className={classes.divider}/>
                            <Typography variant="h6" color="textSecondary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px"}}>
                                {hotel.address}
                            </Typography>
                            <div>
                                <Location location={hotel.location}/>
                            </div>
                            <Divider className={classes.divider}/>
                            <Typography variant="h5" color="textPrimary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px", marginBottom: "20px"}}>
                                Booking
                            </Typography>
                            {
                                user ? 
                                <BookingForm hotel={hotel} user={user} setBooking={setBooking}/> : 
                                <div className={classes.sliderContainer}>
                                    <Button variant="contained" color="secondary" component={Link} to={"/auth"}>
                                        Login to Book
                                    </Button>
                                </div>
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </main>
    )
};

export default HotelDetails;
