import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Divider from '@material-ui/core/Divider';

import SomeStyle from './SomeStyle'

const foo = makeStyles(SomeStyle)

const useStyles = makeStyles({
  root: {
    //width: '100%',
    //maxWidth: 600,
  },
  table: {
    minWidth: 650,
  },
  attributes: {
    minWidth: 300,
  },
  denselist: {
    "padding-top": 0,
    "padding-bottom": 0,
  },
});

function Attributes(props) {
  const classes = useStyles();
  let rows = [];

  Object.keys(props.item).forEach(key => {
    if (key === "data" || key === "key") {
      return;
    }
    rows.push({"key":key, "value":props.item[key]});
  });

  return (
    <List dense className={classes.root}>
      {rows.map((row) => (
        <ListItem classes={foo}>
          {/*<ListItemText primary={row.value} secondary={row.key} />*/}
          <ListItemText primary={row.value}/>
        </ListItem>
      ))}
    </List>
  );
}

function Data(props) {
  const data = props.item.data;
  return (
    <p>{data}</p>
  );
}

export default function BasicTable(props) {
  const classes = useStyles();
  const rows = props.items;
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Attributes</TableCell>
            <TableCell align="right">Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow hover key={row.name}>
              <TableCell component="th" scope="row">
                <Attributes item={row} />
              </TableCell>
              <TableCell align="right">
                <Data item={row} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
