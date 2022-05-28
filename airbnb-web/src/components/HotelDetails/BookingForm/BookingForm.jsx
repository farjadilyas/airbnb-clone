import React, { useState, useEffect } from 'react'

import { Typography, Avatar } from '@material-ui/core';
import { Slider, Divider, Button } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import DateTimePicker from 'react-datetime-picker';

import { images } from '../../../constants';
import { functions } from '../../../constants';

import useStyles from './styles';

const BookingForm = ({ hotel, user, setBooking }) => {
    // Using Styles
    const classes = useStyles();

    // Using State Variables
    const [checkin, setCheckin] = useState(new Date());
    const [checkout, setCheckout] = useState(new Date());
    const [totalPrice, setTotalPrice] = useState(0);
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [pets, setPets] = useState(0);

    // Function to calculate total price
    const calculateTotalPrice = () => {
        if (!hotel)
            return; 

        let days = functions.getDayDiff(checkin, checkout);
        if (days >= 0) {
            let multiplier = days * hotel.price;
            let sum = adults * multiplier;
            sum += children * 0.5 * multiplier;
            sum += infants * 0.3 * multiplier;
            sum += pets * 0.1 * multiplier;
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }

    // Using State change to calculate total price
    useEffect(() => {
        calculateTotalPrice();
    }, [checkin, checkout, adults, children, infants, pets])

    // Function to set the Booking object for processing
    const createBooking = () => {
        var bookingData = {
            user: user._id,
            host: hotel.host._id,
            hotel: {
                _id: hotel._id,
                name: hotel.name,
                beds: hotel.beds,
                price: hotel.price,
            },
            active: false,
            numGuests: {
                adults: adults,
                children: children,
                infants: infants,
                pets: pets
            },
            checkin: checkin,
            checkout: checkout,
            totalPrice: totalPrice
        }
        setBooking(bookingData);
    }

    // Building Layout
    return (
        <>
            <div className={classes.sliderContainer}>
                <div className={classes.sliderInput}>
                    <Avatar className={classes.purple} alt={hotel.host.firstName + " " + hotel.host.lastName} src={images.adultIcon} />
                    <Slider defaultValue={0} valueLabelDisplay="auto" step={1} marks min={0} max={hotel.beds} value={adults} onChange={(event, newValue) => {setAdults(newValue)}}/>
                    <Typography variant="h6" color="textSecondary">Adults</Typography>
                </div>
                <div className={classes.sliderInput}>
                    <Avatar className={classes.purple} alt={hotel.host.firstName + " " + hotel.host.lastName} src={images.kidsIcon} />
                    <Slider defaultValue={0} valueLabelDisplay="auto" step={1} marks min={0} max={hotel.beds} value={children} onChange={(event, newValue) => {setChildren(newValue)}}/>
                    <Typography variant="h6" color="textSecondary">Children</Typography>
                </div>
                <div className={classes.sliderInput}>
                    <Avatar className={classes.purple} alt={hotel.host.firstName + " " + hotel.host.lastName} src={images.infantIcon} />
                    <Slider defaultValue={0} valueLabelDisplay="auto" step={1} marks min={0} max={hotel.beds} value={infants} onChange={(event, newValue) => {setInfants(newValue)}}/>
                    <Typography variant="h6" color="textSecondary">Infants</Typography>
                </div>
                <div className={classes.sliderInput}>
                    <Avatar className={classes.purple} alt={hotel.host.firstName + " " + hotel.host.lastName} src={images.petIcon} />
                    <Slider defaultValue={0} valueLabelDisplay="auto" step={1} marks min={0} max={hotel.beds} value={pets} onChange={(event, newValue) => {setPets(newValue)}}/>
                    <Typography variant="h6" color="textSecondary">Pets</Typography>
                </div>
            </div>
            <div className={classes.sliderContainer} style={{ marginTop: '30px', alignItems: 'center' }}>
                <div className={classes.sliderInput}>
                    <Typography variant="h6" color="textSecondary">From</Typography>
                    <DateTimePicker value={checkin} onChange={(newValue) => {setCheckin(newValue)}} />
                </div>
                <ArrowForward />
                <div className={classes.sliderInput}>
                    <Typography variant="h6" color="textSecondary">To</Typography>
                    <DateTimePicker value={checkout} onChange={(newValue) => {setCheckout(newValue)}} />
                </div>
            </div>
            <Divider className={classes.divider}/>
            <div className={classes.sliderContainer} style={{ marginTop: '30px', alignItems: 'center' }}>
                <Typography variant="h5" color="textPrimary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px", marginBottom: "20px"}}>
                    Total Price
                </Typography>
                <Typography variant="h5" color="textPrimary" gutterBottom style={{ marginLeft: "20px", marginTop: "10px", marginBottom: "20px"}}>
                    $ {totalPrice.toFixed(2)}
                </Typography>
                <Button variant="contained" color="secondary" component={Link} to={"/payment"} onClick={createBooking}>
                    Continue to Payment
                </Button>
            </div>
        </>
    )
}

export default BookingForm
