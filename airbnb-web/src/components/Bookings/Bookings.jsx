import React, { useState } from "react";
import { Grid, CircularProgress, Tab, Tabs, Box } from "@material-ui/core";

import ActiveBooking from "./ActiveBooking/ActiveBooking";
import HistoryBooking from "./HistoryBooking/HistoryBooking";
import useStyles from './styles';

const Bookings = ({ bookings }) => {
    // Using Styles
    const classes = useStyles();

    // Using State
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Component Select
    const componentSelect = (value) => {
        switch(value) {
            case 0:
                return (
                    <Grid container justify="center" spacing={4}>
                    { 
                        bookings.map((booking) => (
                            booking.active ? (
                                <Grid item key={booking.id} xs={8} sm={8} ms={8} lg={8}>
                                    <ActiveBooking booking={booking} />
                                </Grid>
                            ) : <></>
                        ))
                    }
                    </Grid>
                )
            case 1:
                return (
                    <Grid container justify="center" spacing={4}>
                    { 
                        bookings.map((booking) => (
                            !booking.active ? (
                                <Grid item key={booking.id} xs={4} sm={4} ms={4} lg={4}>
                                    <HistoryBooking booking={booking} />
                                </Grid>
                            ) : <></>
                        ))
                    }
                    </Grid>
                )
            default:
                return <></>
        }
    }

    // Loading
    if (!bookings.length) {
        return (
            <>
                <div className={classes.toolbar} />
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                        <Tab label="Active" />
                        <Tab label="History" />
                    </Tabs>
                </Box>
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
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                        <Tab label="Active" />
                        <Tab label="History" />
                    </Tabs>
                </Box>
                <Box paddingTop={2}>
                    {componentSelect(value)}
                </Box>
            </Box>
        </main>
    )
}

export default Bookings;
