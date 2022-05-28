import React from 'react';
import { useDispatch } from 'react-redux';

import { Card, CardMedia, CardContent, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { fetchHotel } from '../../../actions/hotel';

import useStyles from './styles';

const Hotel = ({ hotel, setHotel }) => {

    // Using Styles
    const classes = useStyles();

    // Using Dispatch
    const dispatch = useDispatch();

    // Loading Hotel Data
    const loadHotelData = () => {
        dispatch(fetchHotel(hotel._id, setHotel));
    }

    // Building Layout
    return (
        <Card className={classes.root}>
            <Link to="/hotel" onClick={loadHotelData} style={{ textDecoration: 'none' }}>
                <CardMedia className={classes.media} image={hotel.img} title={hotel.name} />
                <CardContent>
                    <div className={classes.cardContent}>
                        <Typography variant="h6" gutterBottom>
                            {hotel.name}
                        </Typography>
                        <Typography variant="h8">
                            {hotel.ratings}★
                        </Typography>
                    </div>
                    <Typography variant="body2" color="textSecondary">
                        {hotel.beds} beds
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        ${hotel.price}/night
                    </Typography>
                </CardContent>
            </Link>
        </Card>
    )
};

export default Hotel;
