import React, {Component} from "react";

import {
  Box,
  Button,
  Collapsible,
  Heading,
  Grid,
  Grommet,
  Layer,
  Header,
  ResponsiveContext,
  Form, FormField, TextInput, Select,
} from 'grommet';

import {Add, Dashboard, View} from 'grommet-icons';

import {FormClose, Notification} from 'grommet-icons';

import {Fab, Action} from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import ReconnectingWebSocket from 'reconnecting-websocket';

import CloudEvent from './CloudEvent'

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
    colors: {
      brand: '#228BE6',
    },
  },
  card: {
    footer: {
      pad: {horizontal: 'medium', vertical: 'small'},
      background: '#FFFFFF27',
    },
  },
};

const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{left: 'medium', right: 'small', vertical: 'small'}}
    elevation='medium'
    style={{zIndex: '1'}}
    {...props}
  />
);

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSidebar: false,
      showAdd: false,
      //cards: data,
      events: [],
      search: "",
    }
    this.next = 1;
  }

  componentDidMount() {
    console.log("Protocol: " + window.location.protocol);
    let wsURL = "ws://" + document.location.host + "/ws";
    if (window.location.protocol === 'https:') {
      wsURL = "wss://" + document.location.host + "/ws";
    }

    wsURL = "ws://sockeye.default.20.190.7.108.xip.io/ws";

    console.log("WS URL: " + wsURL);

    let that = this;

    let sock = new ReconnectingWebSocket(wsURL);
    sock.onopen = function () {
      console.log("connected to " + wsURL);
      //let fab = document.getElementById("fab");
      //fab.setAttribute("sockeye-connected", "true");
    };
    sock.onclose = function (e) {
      console.log("connection closed (" + e.code + ")");
      //fab.setAttribute("sockeye-connected", "false");
    };
    sock.onmessage = function (e) {
      window.dispatchEvent(new Event('cloudevent'));
      let t = JSON.parse(JSON.parse(e.data)); // at the moment the ws sends down a double encoded thing.

      console.log(t)
      that.onCloudEvent(t)

      // let key = "no-subject";
      // if (t["subject"])  {
      //   key = t["subject"]
      // }

      //let log = subjects[key];

      // if (!log) {
      //   log = makeTable(key);
      //
      //   injectPad(main);
      //   main.appendChild(log);
      //   injectPad(main);
      //
      //   subjects[key] = log;
      // }

      // let doScroll = window.scrollTop > window.scrollHeight - window.clientHeight - 1;
      // //appendRow(log, t);
      // if (doScroll) {
      //   window.scrollTop = window.scrollHeight - window.clientHeight;
      // }
    };
  }

  shouldDisplay(event) {
    if (this.state.search === "") {
      return true;
    }
    return event.id.includes(this.state.search)
  }

  handleAdd() {
    console.log("here on handle click add")
    //this.add(data[this.next % data.length])
  }

  onCloudEvent(event) {
    let data = {id: event.id};

    Object.keys(event).forEach(key => {
      if (key === "data") {
        data[key] = JSON.stringify(event[key]);
        return;
      }
      data[key] = event[key];
    });

    let al = [...this.state.events];
    al.unshift(data)

    this.setState( {
        events: al
    });
  }

  add(entry) {
    this.setState(state => {
      const list = [...state.cards, entry];
      return {
        cards: list
      };
    });
    this.next++;
  }

  handleView() {
    console.log("here on handle click view")
    this.setState({showAdd: true})
  }


  render() {
    var boundClickAdd = this.handleAdd.bind(this);
    var boundClickView = this.handleView.bind(this);

    const events = this.state.events;
    const { showSidebar } = this.state;

    return (
      <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
          {size => (
            <Box flex>
              <AppBar>
                <Heading level='3' margin='none'>My App</Heading>
                <TextInput
                  placeholder="type here"
                  value={this.state.search}
                  onChange={event => this.setState({search: event.target.value})}
                />
                <Button
                  icon={<Notification/>}
                  onClick={() => {console.log("here" + this.state.showSidebar);
                    this.setState({showSidebar: !this.state.showSidebar}) }}
                />
              </AppBar>
              <Box direction='row' flex overflow={{horizontal: 'hidden'}}>
                <Box direction='column' flex pad="medium">
                    {events.map((event) => {
                      if (this.shouldDisplay(event)) {
                        return (
                          <CloudEvent event={event}/>
                        )
                      }
                      return <></>
                    })}
                  </Box>

                {(!this.state.showSidebar || size !== 'small') ? (
                  <Collapsible direction="horizontal" open={this.state.showSidebar}>
                    <Box
                      flex
                      width='medium'
                      background='light-2'
                      elevation='small'
                      align='center'
                      justify='top'
                    >

                    </Box>
                  </Collapsible>
                ): (
                  <Layer>
                    <Box
                      background='light-2'
                      tag='header'
                      justify='end'
                      align='center'
                      direction='row'
                    >
                      <Button
                        icon={<FormClose />}
                        onClick={() => this.setState({ showSidebar: false})}
                      />
                    </Box>
                    <Box
                      fill
                      background='light-2'
                      align='center'
                      justify='center'
                    >

                    </Box>
                  </Layer>
                )}
              </Box>



              {(!this.state.showAdd && (!this.state.showSidebar || size !== 'small')) && (
                <Fab
                  mainButtonStyles={{backgroundColor: theme.global.colors.brand}}
                  style={{bottom: 10, right: 10}}
                  onClick={boundClickAdd}
                  icon={<Dashboard color="white"/>}
                >
                  <Action
                    text="Add"
                    onClick={boundClickAdd}
                  >
                    <Add color="white"/>
                  </Action>
                  <Action
                    text="View"
                    onClick={boundClickView}
                  >
                    <View color="white"/>
                  </Action>
                </Fab>
              )}
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    );
  }
}

export default App;
