import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  root: {
    flexGrow: 1,
  },
  loading: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '10px'
  },
  divider: {
    marginTop: "25px", 
    marginBottom: "25px"
  },
  buttonsContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: '35px'
  },
  bookingData: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '30px',
    marginLeft: '15px'
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center'
  },
  successCard: {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    minHeight: '350px', 
    justifyContent: 'space-evenly'
  }
}));
