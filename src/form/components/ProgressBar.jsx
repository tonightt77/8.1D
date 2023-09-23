import React from 'react'
import { Progress, Segment } from 'semantic-ui-react'

const ProgressBar = (props) => (
    <Progress percent={props.percent} progress success={props.success}>
      {props.msg}
    </Progress>
)
export default ProgressBar