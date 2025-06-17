import React from 'react';
import {makeStyles} from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import './Json.css';


import './App.css';

// import XMLViewer from 'react-xml-viewer' // Removed due to compatibility issues

import Attributes from './Attributes';
import Data from './Data';

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

export default function BasicTable(props) {
  const classes = useStyles();
  const rows = props.items;
  const filter = props.filter;

  function evalFilter(event) {
    for (let i = 0; i < filter.length; ++i) {
      if (filter[i].attr in event) {
        switch (filter[i].match) {
          case "Exact":
            if (event[filter[i].attr] !== filter[i].value) {
              return false;
            }
            break;
          case "Includes":
            if (!event[filter[i].attr].includes(filter[i].value)) {
              return false;
            }
            break;
          case "Prefix":
            if (!event[filter[i].attr].startsWith(filter[i].value)) {
              return false;
            }
            break;
          case "Suffix":
            if (!event[filter[i].attr].endsWith(filter[i].value)) {
              return false;
            }
            break;
          default:
            break;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  return (
    <>
    {filter.map((f) => (<Fade in={true}><p>{f.attr} [{f.match}] {f.value}</p></Fade>))}
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Attributes</TableCell>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>



          {rows.filter(evalFilter).map((row) => (
            <Fade in={true} mountOnEnter={true} appear={true} timeout={300}>
            <TableRow hover key={row.id}>
              <TableCell component="th" scope="row" className={classes.attributes}>
                <Attributes item={row}/>
              </TableCell>
              <TableCell>
                <Data item={row}/>
              </TableCell>
            </TableRow>
            </Fade>
            ))}


        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}
