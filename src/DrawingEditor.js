import React, { Component } from 'react'

import {
  View,
  Layer,
  Group,
  Path,
  Circle,
  Ellipse,
  Rectangle,
  PointText,
  Tool,
  Paper,
  Project,
  PathCircle,
  Tools
} from 'react-paper-bindings'

class DrawingEditor extends Component {

	constructor(props) {
	    super(props);
    }

    render() {

    	return (
			<Paper width={600} height={400}>
			  <Project>
			    <Layer>
			      <PathCircle center={[80, 50]} radius={30} strokeColor={'black'} />
			    </Layer>
			    <Layer>
			      <PathCircle center={[180, 150]} radius={40} strokeColor={'red'} />
			    </Layer>
			  </Project>
			</Paper>
    		)
    }
}

export default DrawingEditor;