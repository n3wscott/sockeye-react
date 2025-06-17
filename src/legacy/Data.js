import React, { Component } from 'react';

import {
  Box, List,
} from 'grommet';

import JSONPretty from "react-json-pretty";

const DataView = (props) => {
  let data = props.data;

  let mediaType = props.mediaType

  if (mediaType.startsWith("application/json") || mediaType.startsWith("text/json")) {
    if (data.startsWith("\"")) {
      data = JSON.parse(data);
    }
    let src = JSON.parse(data);

    return (
        <JSONPretty data={src}/>
    );
  }
  if (mediaType.startsWith("application/xml") || mediaType.startsWith("text/xml")) {
    if (data.startsWith("\"")) {
      // Data was part of a JSON string, parse it.
      data = JSON.parse(data);
    }
    return (
        <pre>
        {data}
      </pre>
    );
  }
  if (mediaType.startsWith("image/")) {
    if (data.startsWith("\"")) {
      data = JSON.parse(data);
    }
    if (typeof data === 'string' && data.startsWith('data:image/')) {
      return (
        <img src={data} alt="CloudEvent data" style={{ maxWidth: '100%', height: 'auto' }} />
      );
    }
  }
  if (data.startsWith("\"")) {
    data = JSON.parse(data);
  }
  return (
      <pre>
      {data}
    </pre>
  )
}

// TODO: not used.
export class Data extends Component {
  render() {
    if (!this.props.item) {
      return <Box>No event data</Box>;
    }

    let data = this.props.item.data;

    let data_base64 = null;
    if ("data_base64" in this.props.item) {
      data_base64 = this.props.item["data_base64"];
    }

    if (data_base64 !== null) {
      try {
        data = atob(data_base64);
      } catch (err) {
        console.error(err);
        data = data_base64;
      }
    }

    let mediaType = "unknown";
    if ("datacontenttype" in this.props.item) {
      mediaType = this.props.item["datacontenttype"]
    }

    return(
      <DataView data={data} mediaType={mediaType}/>
    )
  }
}

export default Data;