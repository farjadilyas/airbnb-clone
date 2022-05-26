import React from "react";
import { Grid, CircularProgress } from "@material-ui/core";

import Hotel from "./Hotel/Hotel";
import useStyles from './styles';

const Hotels = ({ hotels, onAddToCart }) => {
    // Using Styles
    const classes = useStyles();

    // Loading
    if (!hotels.length) {
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
                { hotels.map((hotel) => (
                    <Grid item key={hotel.id} xs={12} sm={6} ms={4} lg={3}>
                        <Hotel hotel={hotel} onAddToCart={onAddToCart} />
                    </Grid>
                )) }
            </Grid>
        </main>
    )
}

export default Hotels;
