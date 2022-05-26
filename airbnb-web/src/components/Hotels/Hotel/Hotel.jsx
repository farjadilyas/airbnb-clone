import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton } from '@material-ui/core';
import { Book } from '@material-ui/icons';

import useStyles from './styles';

const Hotel = ({ hotel, onAddToCart }) => {

    // Using Styles
    const classes = useStyles();

    // Building Layout
    return (
        <Card className={classes.root}>
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
            <CardActions disableSpacing className={classes.cardActions}>
                <IconButton aria-label='Book' onClick={() => onAddToCart(hotel.id, 1)}>
                    <Book />
                </IconButton>
            </CardActions>
        </Card>
    )
};

export default Hotel;
