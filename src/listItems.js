import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ViewListIcon from '@material-ui/icons/ViewList';
import FilterIcon from '@material-ui/icons/Filter';
import AddIcon from '@material-ui/icons/Add';
import List from "@material-ui/core/List";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Autocomplete from '@material-ui/lab/Autocomplete';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <ViewListIcon />
      </ListItemIcon>
      <ListItemText primary="Sockeye" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <FilterIcon />
      </ListItemIcon>
      <ListItemText primary="Triggers" />
    </ListItem>
  </div>
);


const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 300,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const attributes = ["specversion", "datacontenttype", "dataschema", "source", "type", "subject", "time"];

export function Filters(props) {
  const classes = useStyles();

  const [filters, setFilters] = React.useState([]);

  const [filterAttribute, setFilterAttribute] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("");
  const [filterMatch, setFilterMatch] = React.useState(0);

  const handleChange = (event) => {
    setFilterMatch(event.target.value);
  };

  const handleAdd = (event) => {
    console.log("changed: " +  event)
    let match = "Exact";
    switch (filterMatch) {
      case 0:
        match = "Exact";
        break;
      case 1:
        match = "Prefix";
        break;
      case 2:
        match = "Suffix";
        break;
      default:
        match = "Exact";
    }
    let attr = inputValue;
    let val = filterValue;
    if (attr !== "" && val !== "") {
      setFilters(og => {
        return [...og, {key: attr, attr: attr, match: match, value: val}];
      });
      setFilterMatch(0);
      setValue("");
      setInputValue("");
      setFilterValue("");
    } else {
      // TODO: add validation feedback.
    }

  };

  const handleValChange = (event) => {
    setFilterValue(event.target.value);
  };

  const [value, setValue] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');

  return (
    <List>
      <div>{`value: ${value !== null ? `'${value}'` : 'null'}`}</div>
      <div>{`inputValue: '${inputValue}'`}</div>
      <br />
      <ListSubheader inset>Filters</ListSubheader>
      <ListItem>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Attribute</TableCell>
                <TableCell>Match</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filters.map((filter) => (
                <TableRow key={filter.attr} hover>
                  <TableCell component="th" scope="row">{filter.attr}</TableCell>
                  <TableCell>{filter.match}</TableCell>
                  <TableCell>{filter.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ListItem>
      <ListItem>
        <Autocomplete freeSolo options={attributes}
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                      inputValue={inputValue}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                      }}
          renderInput={(params) => (
            <FormControl className={classes.formControl}>
              <TextField id="input-filter-attribute" {...params} label="Attribute"/>
            </FormControl>
          )}
        />
      </ListItem>
      <ListItem>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Match</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterMatch}
            onChange={handleChange}
          >
            <MenuItem value={0}>Exact</MenuItem>
            <MenuItem value={1}>Prefix</MenuItem>
            <MenuItem value={2}>Suffix</MenuItem>
          </Select>
        </FormControl>
      </ListItem>
      <ListItem>
        <FormControl className={classes.formControl}>
          <TextField id="input-filter-value" label="Value" value={filterValue} onChange={handleValChange} type="search"/>
        </FormControl>
      </ListItem>
      <ListItem button onClick={handleAdd}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
      </ListItem>
    </List>
  );
}

