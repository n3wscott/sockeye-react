import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import ReactJson from 'react-json-view';

import Attributes from './Attributes';

const useStyles = makeStyles({
  root: {
    //width: '100%',
    //maxWidth: 600,
  },
  table: {
    minWidth: 650,
    paddingTop: 0,
  },
  attributes: {
    minWidth: 300,
    maxWidth: 500,
  },
});

// TODO: for xml: https://www.npmjs.com/package/react-xml-viewer

function Data(props) {
  const data = props.item.data;

  let src = JSON.parse(data);

  return (
    <ReactJson src={src} name="data" />
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
              <TableCell component="th" scope="row" className={classes.attributes}>
                <Attributes item={row} />
              </TableCell>
              <TableCell>
                <Data item={row} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
