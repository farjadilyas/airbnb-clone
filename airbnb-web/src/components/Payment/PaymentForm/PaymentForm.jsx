import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Button, Divider, CircularProgress } from '@material-ui/core';

import { createBooking } from '../../../actions/booking';

import CardInput from './CardInput/CardInput';

import useStyles from './styles';

const PaymentForm = ({ booking, setSuccess }) => {
    
    // Use State
    const [cardNumber, setCardNumber] = useState('');
    const [cvc, setCvc] = useState('');
    const [expiry, setExpiry] = useState('');
    const [canPay, setCanPay] = useState(false);
    const [formError, setFormError] = useState('');

    // Using Dispatch
    const dispatch = useDispatch();
    
    // Use Styles
    const classes = useStyles();

    // Checking Form availability
    useEffect(() => {
        setFormError('');
        if (cardNumber.length === 19) {
            var splits = cardNumber.split(' ');
            if (splits.length !== 4) {
                setFormError("Please Enter a valid Card Number!");
                return;
            }
        } else {
            setFormError("Please Enter a valid Card Number!");
            return;
        }
        if (expiry.length >= 3) {
            var splits = expiry.split('/');
            if (splits.length !== 2) {
                setFormError("Please Enter a valid Expiry Date");
                return;
            }
            var month = parseFloat(splits[0]);
            if (month <= 0 || month > 12) {
                setFormError("Please Enter a valid Expiry Date");
                return;
            }
        } else {
            setFormError("Please Enter a valid Expiry Date");
            return;
        }
        if (cvc.length !== 3) {
            setFormError("Please Enter a valid CVC");
            return;
        } else {
            setCanPay(true);
        }
    }, [cardNumber, cvc, expiry]);

    // Creating booking
    const sendCreateBooking = () => {
        setCanPay(false);
        setFormError('');
        var bookingData = {
            user: booking.user,
            host: booking.host,
            hotel: booking.hotel._id,
            checkIn: booking.checkin,
            checkOut: booking.checkout,
            numGuests: booking.numGuests,
            cardNumber: cardNumber,
            cvc: cvc
        }
        dispatch(createBooking(bookingData, setSuccess));
    }

    // Building Layout
    return (
        <>
            <Divider className={classes.divider}/>
            <Typography variant="h5" color="textPrimary">Payment Method</Typography>
            <CardInput 
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cvc={cvc}
                setCvc={setCvc}
                expiry={expiry}
                setExpiry={setExpiry}
            />
            <div className={classes.cardRow} style={{ justifyContent: 'center', marginTop: '15px' }}>
                { formError !== '' ? 
                    <Typography variant='body3' color='error'>{formError}</Typography>
                    : <></>
                }
            </div>
            <div className={classes.buttonsContainer}>
                <Button variant="outlined">Back</Button>
                <Button variant="contained" color="secondary" disabled={!canPay} onClick={sendCreateBooking}>
                    Pay { booking ? '$' + booking.totalPrice.toFixed(2) : '' }
                </Button>
            </div>
        </>
    )
};

export default PaymentForm;
