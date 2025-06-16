import React, { useEffect, useRef } from 'react'
import Table from './Table';
import Filters from './Filters';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CachedIcon from '@mui/icons-material/Cached';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import GitHubIcon from '@mui/icons-material/GitHub';

function Source() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" href="https://github.com/n3wscott/sockeye-react">
        <GitHubIcon/>
      </Link>
    </Typography>
  );
}

const drawerWidth = 400;

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    minHeight: 64,
  },
  appBar: {
    zIndex: 1200,
    transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    '@media (min-width:600px)': {
      width: 0,
    },
  },
  appBarSpacer: {
    minHeight: 64,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  paper: {
    padding: 16,
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  sockeyeLogo: {
    height: 60,
    paddingRight: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
}));

export default function Dashboard(props) {
  const events = props.items;

  const endRef = useRef(null)

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [scrollLock, setScrollLock] = React.useState(true);

  const [filter, setFilter] = React.useState([]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleScrollLock = () => {
    setScrollLock(!scrollLock);
    if (scrollLock) {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }
  };

  const handleWheel = (e) => {
    if (scrollLock) {
      setScrollLock(false);
    }
  };

  // After render.
  useEffect(() => {
    if (scrollLock) {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }
  });

  let ScrollLockIcon = LockIcon;
  if (!scrollLock) {
    ScrollLockIcon = LockOpenIcon;
  }


  return (
    <div className={classes.root} onWheel={handleWheel}>
      <CssBaseline />
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleScrollLock}>
        <ScrollLockIcon />
      </Fab>
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Sockeye
          </Typography>
          <IconButton color="inherit">
            <ClearAllIcon />
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={events.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
           <CachedIcon onClick={() => props.revert()} />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <img className={classes.sockeyeLogo} alt={""} src="http://sockeye.default.20.190.7.108.xip.io/static/assets/sockeye-logo.png" />
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <Filters onChange={(event, newFilter) => {
          console.log(newFilter)
          setFilter(newFilter);
        }}/>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Paper>
            <Table items={events} filter={filter}/>
          </Paper>
          
          <div ref={endRef} />

          <Box pt={4}>
            <Source />
          </Box>
        </Container>
      </main>
    </div>
  );
}
