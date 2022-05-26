import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { images } from '../../constants'
 
import useStyles from './styles'


const Navbar = () => {
    // Using Styles
    const classes = useStyles();

    // Building Layout
    return (
        <>
            <AppBar position='fixed' className={classes.appBar} color="inherit">
                <Toolbar>
                    <Typography variant='h6' className={classes.title} color='inherit' component={Link} to="/">
                        <img src={images.logo} alt="airbnb" height="25px" className={classes.image} />
                        airbnb
                    </Typography>
                    <div className={classes.grow}/>
                </Toolbar>
            </AppBar>
        </>
    )
};

export default Navbar;
