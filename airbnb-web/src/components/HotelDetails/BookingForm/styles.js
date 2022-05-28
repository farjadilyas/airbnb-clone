import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  imageControl: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
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
    top: '50%',
    left: '50%',
    position: 'absolute',
  },
  divider: {
    marginTop: "25px", 
    marginBottom: "25px"
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sliderInput: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '100px',
    alignItems: 'center'
  }
}));
