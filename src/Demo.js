import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import JSONPretty from 'react-json-pretty';
import Fade from '@material-ui/core/Fade';
import './Json.css';
import Slide from '@material-ui/core/Slide';
import Collapse from '@material-ui/core/Collapse';
import CircularProgressWithLabel from './CircularProgressWithLabel';


import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ListSubheader from '@material-ui/core/ListSubheader';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Box from '@material-ui/core/Box';


import './App.css';

import XMLViewer from 'react-xml-viewer'

import Attributes from './Attributes';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  // nested: {
  //   // paddingLeft: 4,
  // },
});


const data = {
  run: "knative.dev/reconciler-test/61463fb6-3cf0-4767-b095-2ed2b47ed0c7",
  environment: {
    featureState:"Any",
    namespace:"test-iwpuyldo",
    requirementLevel:"All"
  },
  tests :[{
    name: "TestBrokerConformance",
    progress: "60/99",
    features: [{
      name: "Broker",
      progress: "60/99",
      steps:[{
        
      }],
    },{
      name: "Trigger, Given Broker",
      progress: "6/10",
      steps:[{
        
      }],
    }],
  }],
};


function Feature(props) {
  const classes = useStyles();
  
  return (
    <Accordion>
      <AccordionSummary expandIcon={<CircularProgressWithLabel value={props.progress} />} aria-controls="panel1a-content" id="panel1a-header">
        <Box position="relative" display="inline-flex">
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant={classes.heading}> {props.name}</Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
          sit amet blandit leo lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

function NestedList() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Nested List Items
        </ListSubheader>
      }
      className={classes.root}
    >
      <ListItem button>
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary="Sent mail" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <DraftsIcon />
        </ListItemIcon>
        <ListItemText primary="Drafts" />
      </ListItem>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
}

export default function BasicTable(props) {
  const classes = useStyles();

  return (
    <>
      <List className={classes.root}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Features" secondary={ data.environment.featureState } />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Requirement" secondary={ data.environment.requirementLevel } />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Namespace" secondary={ data.environment.namespace } />
      </ListItem>
    </List>


    {data.tests.map((row) => (
      <Fade in={true} mountOnEnter={true} appear={true} timeout={300}>
      
      <NestedList/>
      
        <Accordion>
          <AccordionSummary expandIcon={<CircularProgressWithLabel value={row.progress} />} aria-controls="panel1a-content" id="panel1a-header">
            <Box position="relative" display="inline-flex">
              <Box display="flex" alignItems="center" justifyContent="center">
                <Typography variant={classes.heading}> {row.name}</Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
      
      
      
            {row.features.map((f) => (
              <Feature name={f.name} progress={f.progress} steps={f.steps} />
            ))}
          </AccordionDetails>
        </Accordion>
      </Fade>
    ))}
    </>
  );
}
