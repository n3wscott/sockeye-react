import React, { Component } from "react";
import Dashboard from './Dashboard';
import "./App.css"
import ReconnectingWebSocket from 'reconnecting-websocket';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      revert: false,
      open: false,
    }
  }

  handleRevert(e) {
    this.setState({ revert: !this.state.revert })
    this.setState({
      events: this.state.events.reverse()
    });
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
    };
  }

  onCloudEvent(event) {

    let data = { id: event.id };

    Object.keys(event).forEach(key => {
      if (key === "data") {
        data[key] = JSON.stringify(event[key]);
        return;
      }
      data[key] = event[key];
    });

    let al = [...this.state.events];

    if (this.state.revert) {
      if (data["data"] != null) {
        al.push(data);
        this.setState({
          events: al.reverse()
        });
        return;
      }
      if (data["data"] === undefined) {
        this.showError();
        console.log("More information on the invalid event: ", event);
        return;
      }

    } 
    
    if (!this.state.revert) {
      if (data["data"] != null) {
        al.push(data);
        this.setState({
          events: al
        });
        return;
      }
      if (data["data"] === undefined) {
        this.showError();
        console.log("More information on the invalid event: ", event);
        return;
      }


    }
  }


    showError() {
      this.setState({ open: !this.state.open });
    }




  render() {
    const events = this.state.events;
    return (
      <div>
        <Dashboard items={events} revert={() => this.handleRevert()} />
        <Snackbar open={this.state.open} autoHideDuration={6000} >
          <Alert severity="error">
            Event received with an invalid or missing data payload. Check the console for more information
          </Alert>
        </Snackbar>
      </div >
    );
  }
}

export default App;
