import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Avatar } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import { images } from '../../constants'
 
import useStyles from './styles'


const Navbar = ({ user, logout, loadBookings }) => {
    // Using Styles
    const classes = useStyles();
    
    // Building Layout
    return (
        <>
            <AppBar position='fixed' className={classes.appBar} color="inherit">
                <Toolbar>
                    <Typography variant='h5' className={classes.title} color='inherit' component={Link} to="/">
                        <img src={images.logo} alt="airbnb" height="25px" className={classes.image} />
                        airbnb
                    </Typography>
                    <div className={classes.grow}/>
                    { user ? (
                            <div className={classes.profile}>
                                <Avatar className={classes.purple} alt={user.firstName + " " + user.lastName} src={user.imageUrl}>
                                    {user.firstName.charAt(0)}
                                </Avatar>
                                <Typography className={classes.userName} variant="h6">
                                    {user.firstName + " " + user.lastName}
                                </Typography>
                                <Button component={Link} to="/bookings" variant="contained" className={classes.logout} color="secondary" onClick={loadBookings}>
                                    Bookings
                                </Button>
                                <Button variant="outlined" className={classes.logout} color="gray" onClick={logout}>Logout</Button>
                            </div>
                        ) : (
                            <div className={classes.button}>
                                <IconButton component={Link} to="/auth" aria-label='Login/SignUp' color='inherit'>
                                    <AccountCircle />
                                </IconButton>
                            </div>
                        )}
                </Toolbar>
            </AppBar>
        </>
    )
};

export default Navbar;
