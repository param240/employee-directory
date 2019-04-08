import React, { Component } from 'react';
import * as apiUtil from '../utils/api-util';
import { Link } from 'react-router-dom';

export default class Thumbnail extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.history.push(`/home/${this.props.employee.employeeId}`)
    }

    render () {
        const employee = this.props.employee;
        return (
            <div>
                <div style={{ display: 'inline'}}>
                    <img src={"data:image/jpeg;base64," + employee.pic} width="50" height="50" style={{borderRadius: '8px'}}/>
                </div>
                <Link to={`/home/${employee.employeeId}`} onClick={this.handleClick}
         className="thumbnail-link"><u><b>{employee.name}</b></u></Link>
            </div>
        )
    }
}