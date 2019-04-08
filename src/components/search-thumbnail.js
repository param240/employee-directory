import React, { Component } from 'react';
import * as apiUtil from '../utils/api-util';
import { Link } from 'react-router-dom';
import { Col, Row } from 'antd';

export default class SearchThumbnail extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.history.push(`/home/${this.props.employee.employeeId}`)
    }

    render() {
        const employee = this.props.employee;
        return (
            <div className="search-thumbnail">
                <img src={"data:image/jpeg;base64," + employee.pic} width="100" height="100" style={{borderRadius: '8px'}}/>
                <Link to={`/home/${employee.employeeId}`} onClick={this.handleClick}
                    className="thumbnail-link"><u><b>{employee.name}</b></u></Link>

            </div>
        )
    }
}