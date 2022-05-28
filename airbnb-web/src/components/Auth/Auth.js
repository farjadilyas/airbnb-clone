import React, { useState,  useEffect } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core'
import useStyles from './styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Input from './Input'
import Icon from './Icon'
import { useDispatch, useSelector } from 'react-redux'
import { signin, signup } from '../../actions/user'

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = ({ setUser }) => {

    // Setting constants
    const classes = useStyles();
    const dispatch = useDispatch();

    // Auth Error Message
    const [authError, setAuthError] = useState("");

    // Form data set
    const [formData, setFormData] = useState(initialState);

    // Sign In/Up Handler
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isSignUp) {
            dispatch(signup(formData, setAuthError, setUser));
        } else {
            dispatch(signin(formData, setAuthError, setUser));
        }
    };

    // Form Handlers
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Show Password Handlers
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)

    // Password State
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp)
        if (showPassword)
            handleShowPassword(false)
        setAuthError("");
    }

    // Building HTML
    return (
        <div>
            <Container component="main" maxWidth="xs">
                <Paper className={classes.paper} elevation={3}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon color='primary'/>
                    </Avatar>
                    <Typography variant="h5">
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Typography>
                    <Typography variant="body1" className={classes.error}>
                        {authError.message}
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {
                                isSignUp && (
                                    <>
                                        <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                        <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                                    </>
                                )
                            }
                            <Input name="email" label="Email Address" handleChange={handleChange} type="email"/>
                            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/>
                            { isSignUp && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password"/> }
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                            {isSignUp ? "Sign Up" : "Sign In"}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Button onClick={switchMode} color="secondary" variant="contained" fullWidth>
                                    { isSignUp ? "Already have an account? Sign In " : "Don't have an account? Sign Up" }
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </div>
    )
}

export default Auth;
