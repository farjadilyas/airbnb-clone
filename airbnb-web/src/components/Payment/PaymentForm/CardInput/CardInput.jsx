import React, { useState } from 'react'
import { Grid, TextField } from '@material-ui/core';
import { CreditCard } from '@material-ui/icons';

const CardInput = ({ cardNumber, setCardNumber, cvc, setCvc, expiry, setExpiry }) => {
    
    // Building Layout
    return (
        <Grid container justify="center" spacing={2} alignItems="center" alignContent='center'>
            <Grid item xs={1}>
                <div style={{ marginTop: '15px' }}>
                    <CreditCard />
                </div>
            </Grid>
            <Grid item xs={5}>
                <TextField 
                    type="tel" 
                    placeholder="XXXX XXXX XXXX XXXX" 
                    label="Card Number" 
                    fullWidth 
                    required
                    value={cardNumber} 
                    inputProps={{ pattern: "[0-9\s]{13,19}", maxlength: "19" }}
                    onChange={(e) => setCardNumber(e.target.value)}
                    />
            </Grid>
            <Grid item xs={3}>
                <TextField 
                    type="tel" 
                    placeholder="MM/YY" 
                    label="Expiration Date" 
                    fullWidth 
                    required 
                    value={expiry}
                    inputProps={{ pattern: "[0-12]/[0-12]", maxlength: "5" }}
                    onChange={(e) => setExpiry(e.target.value)}/>
            </Grid>
            <Grid item xs={3}>
                <TextField 
                    type="tel" 
                    placeholder="CVC" 
                    label="CVC" 
                    fullWidth 
                    required 
                    value={cvc}
                    inputProps={{ maxlength: "3" }}
                    onChange={(e) => setCvc(e.target.value)}/>
            </Grid>
        </Grid>
    )
}

export default CardInput
