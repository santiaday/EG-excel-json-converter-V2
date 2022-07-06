import { makeStyles, fade } from '@material-ui/core/styles';

const drawerWidth = 0;



export default makeStyles((theme) => ({
    
    toolbar: theme.mixins.toolbar,
  title: {
    marginTop: "175px",
    width:"100%",
    textAlign:"left"
  },  
  appBar: {
    boxShadow: 'none',
    background: "#000099",
    alignItems: 'center',
    textAlign:"center",
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  image: {
  },

  badge: {
    position: "absolute",
    minWidth: '30px',
    lineHeight: 1,
    height: '42px',
    color: "#FFFFFF",
    "& .MuiBadge-badge": { fontSize: 13, borderRadius: 25,fontWeight: 700, height: 25, minWidth: 25, backgroundColor: "#71CE7E"},
  },

  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'white',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  logo: {
      maxWidth: "290px",
      maxHeight: "164px",
      display: "flex",
      alignItems: "center",
      marginTop: "22%",
      marginBottom: "15%"
  },
  dropzone: {
    justifyContent: "center",
    alignitems: "center",
    textAlign: "center",
    border: "2px solid black",
    background: "rgba(128,128,128, 0.1)",
    transition: "background 0.15s ease-in-out",
    borderRadius: "25px",
    width: "80%",
    maxWidth: "982px",
    height: "25vh",
    '&:hover': {
      background: "rgba(128,128,128, 0.3)",
      transition: "background 0.15s ease-in-out"
    },
    textAlign: "center",
    cursor: "pointer",
    overflow: "hidden",
    overflowWrap: "break-word",
    whiteSpace: "nowrap"
  },
  button: {
     background: "#000099",
     transition: "background 0.15s ease-in-out",
     color: "white",
     border: "2px solid #000099",
     margin: "5px 5px 5px 5px",
     marginTop: "1%",
     borderRadius: "10px",
     cursor: "pointer",
     fontWeight: "bold",

     '&:hover': {
      background: "#00006A",
      border: "2px solid #000099",
      transition: "background 0.15s ease-in-out"
    }},
    altButton: {
        background: "rgba(56, 55, 55)",
        border: "2px solid rgba(56, 55, 55)",
        transition: "background 0.15s ease-in-out",
        color: "white",
        margin: "5px 5px 5px 5px",
        marginTop: "1%",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",
   
        '&:hover': {
        background: "#000000",
        border: "2px solid #000000",
         transition: "all 0.15s ease-in-out"
       }},
    link: {
      fontSize: "130%", 
      cursor: "pointer", 
      display: "inline-block", 
      marginLeft: "1%", 
      transform: "translateY(10%)",
      
      '&:hover': {
        color: "#000099",
        fontWeight: "500"
      }},
      links : {
        textDecoration: "none",
        color: "black"
      },
      subtitle:{
          marginBottom: "4%"
      }
  }

));