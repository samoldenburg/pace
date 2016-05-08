import React from 'react'
import $ from 'jquery'
import Moment from 'moment'
import LeftPad from 'left-pad'

class Calculator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            unit: props.initialUnit,
            distance: props.initialDistance,
            time: props.initialTime,
            paceTime: props.initialPaceTime
        }
        this.updateUnit = this.updateUnit.bind(this)
        this.convertDistance = this.convertDistance.bind(this)
        this.updatedTime = this.updatedTime.bind(this)
        this.updatedDistance = this.updatedDistance.bind(this)
        this.updatedPace = this.updatedPace.bind(this)
    }
    updateUnit(e) {
        let u = e.target.value
        let d = this.convertDistance(u)

        this.setState({
            unit: u,
            distance: d,
            paceTime: this.state.time / d
        })
    }
    convertDistance(unit) {
        let factor = unit == 'km' ? 1.60934 : 0.621371
        return factor * this.state.distance
    }
    updatedTime(e) {
        let hs = parseInt($('input[name="hours"]').val()) * 60 * 60
        let ms = parseInt($('input[name="minutes"]').val()) * 60
        let s = parseInt($('input[name="seconds"]').val())

        let newTime = hs + ms + s
        let newPace = newTime / this.state.distance
        console.log(newPace)

        this.setState({
            time: newTime,
            paceTime: newPace
        })
    }
    updatedDistance(e) {
        let d = e.target.value;

        this.setState({
            distance: d,
            paceTime: this.state.time / d
        })
    }
    updatedPace(e) {
        let hs = parseInt($('input[name="pace-hours"]').val()) * 60 * 60
        let ms = parseInt($('input[name="pace-minutes"]').val()) * 60
        let s = parseInt($('input[name="pace-seconds"]').val())

        let newPace = hs + ms + s
        let newTime = newPace * this.state.distance

        this.setState({
            time: newTime,
            paceTime: newPace
        })
    }
    componentDidMount() {

    }
    render() {
        let hours = Math.floor(Moment.duration(this.state.time, 'seconds').asHours())
        let minutes = LeftPad(Math.floor(Moment.duration(this.state.time, 'seconds').asMinutes()) - hours * 60, 2, 0)
        let seconds = LeftPad(Math.floor(this.state.time - (minutes * 60) - (hours * 60 * 60)), 2, 0)

        let paceHours = Math.floor(Moment.duration(this.state.paceTime, 'seconds').asHours())
        let paceMinutes = LeftPad(Math.floor(Moment.duration(this.state.paceTime, 'seconds').asMinutes()) - paceHours * 60, 2, 0)
        let paceSeconds = LeftPad(Math.floor(this.state.paceTime - (paceMinutes * 60) - (paceHours * 60 * 60)), 2, 0)

        return (
            <div className="calculator animation-target">
                <h1>Pace Calculator</h1>
                <p>
                    Adjust the numbers below to calculate a pace.<br />
                    You may adjust time, or distance to update the pace time.<br />
                    Changing the pace time will update your total time.
                </p>
                <fieldset className="form-group form-inline" data-section="time">
                    <label>Time</label><br />
                    <input type="number" name="hours" min="0" step="1" max="24" className="form-control" value={hours} onChange={this.updatedTime} /><span>:</span>
                    <input type="number" name="minutes" min="0" max="59" step="1" className="form-control" value={minutes} onChange={this.updatedTime} /><span>:</span>
                    <input type="number" name="seconds" min="0" max="59" step="1" className="form-control" value={seconds} onChange={this.updatedTime} />
                </fieldset>
                <fieldset className="form-group form-inline" data-seciton="distance">
                    <label>Distance</label><br />
                    <input type="number" name="d" min="0" max="1000" step="0.1" className="form-control" value={this.state.distance} onChange={this.updatedDistance} />
                    <select className="form-control" name="unit" value={this.state.unit} onChange={this.updateUnit}>
                        <option value="mi">Miles</option>
                        <option value="km">Kilometers</option>
                    </select>
                </fieldset>
                <fieldset className="form-group form-inline" data-section="pace">
                    <label>Pace</label><br />
                    <input type="number" name="pace-hours" min="0" step="1" max="24" className="form-control" value={paceHours} onChange={this.updatedPace} /><span>:</span>
                    <input type="number" name="pace-minutes" min="0" max="59" step="1" className="form-control" value={paceMinutes} onChange={this.updatedPace} /><span>:</span>
                    <input type="number" name="pace-seconds" min="0" max="59" step="1" className="form-control" value={paceSeconds} onChange={this.updatedPace} /><br />
                    <div id="per">
                        <label>Per:</label>
                        <select className="form-control" name="unit" value={this.state.unit} onChange={this.updateUnit}>
                            <option value="mi">Mile</option>
                            <option value="km">Kilometer</option>
                        </select>
                    </div>
                </fieldset>
                <div className="copy">
                    &copy;2016 Sam Oldenburg. All Rights Reserved.
                    <br />
                    <a href="mailto:sam.oldenburg@gmail.com">Email Me</a> | <a href="https://github.com/samoldenburg/" target="_blank">GitHub</a>
                </div>
            </div>
        )
    }
}

Calculator.propTypes = {
    initialUnit: React.PropTypes.string,
    initialDistance: React.PropTypes.number,
    initialTime: React.PropTypes.number,
    initialPaceTime: React.PropTypes.number
}

let id = 5.0
let it = 1800
let ip = it / id

Calculator.defaultProps = {
    initialUnit: 'km',
    initialDistance: id,
    initialTime: it,
    initialPaceTime: ip
}

export default Calculator
