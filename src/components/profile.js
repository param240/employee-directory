import React, { Component } from 'react';
import { Row, Col, message } from 'antd';
import Thumbnail from './thumbnail';
import * as apiUtil from '../utils/api-util';
import { Link } from 'react-router-dom';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeDetails: {},
            ownProfile: false
        }
    }

    componentWillMount() {
        var employeeId = this.props.match.params.employeeId;
        var loggedUserId;
        var currentUser = localStorage.getItem('directoryUser');
        if (currentUser) {
            currentUser = JSON.parse(currentUser);
            loggedUserId = currentUser['EMPLOYEE ID'];
        }
        if (!employeeId) {
            employeeId = loggedUserId;
        }
        if (employeeId == loggedUserId) {
            this.setState({ ownProfile: true })
        }
        apiUtil.getEmployeeInfo(employeeId, (err, result) => {
            if (err) {
                if (result && result.errorMessage) {
                    message.error(result.errorMessage);
                } else {
                    message.error("Couldn't fetch Employee")
                }
                console.error(result && result.error);
                return;
            }
            if (result) {
                this.setState({ employeeDetails: result });
            }
        })
    }

    getDirectReportees(reportees) {
        if (reportees.length === 0) {
            return (
                <label>No Direct Reportees</label>
            )
        }
        const directReportees = reportees.map((reportee) => {
            return (
                <div key={reportee.employeeId} className="thumbnail"><Thumbnail employee={reportee}></Thumbnail></div>
            )
        });
        return directReportees;
    }

    handleUploadClick() {
        this.props.history.push('/uploadpicture');
    }

    render() {
        var uploadlink = null;
        if (this.state.ownProfile) {
            uploadlink = (
                <Link to={'/uploadpicture/'} onClick={this.handleUploadClick.bind(this)}>
                        Upload new picture
                    </Link>
            )
        }
        if (Object.keys(this.state.employeeDetails).length === 0 && this.state.employeeDetails.constructor === Object) {
            return null;
        }
        const directReportees = this.state.employeeDetails.reportees ? this.getDirectReportees(this.state.employeeDetails.reportees) : null;
        return (
            <div>
                <Col span={12} offset={1}>
                    <Row><img src={"data:image/jpeg;base64," + this.state.employeeDetails.pic} width="400" height="400" style={{borderRadius: '16px'}}/></Row>
                    {uploadlink}
                    <Row><div className="profile-name"><label>{this.state.employeeDetails.name}</label></div></Row>
                    <Row><div className="designation"><label>{this.state.employeeDetails.designation}</label></div></Row>
                    <div className="profile-label-dark">
                        <Col span={8}><label>Employee Id</label></Col>
                        <Col span={12}><label>{this.state.employeeDetails.employeeId}</label></Col>
                    </div>
                    <div className="profile-label-light">
                        <Col span={8}><label>Email Id</label></Col>
                        <Col span={12}><label>{this.state.employeeDetails.emailId}</label></Col>
                    </div>
                    <div className="profile-label-dark">
                        <Col span={8}><label>Group</label></Col>
                        <Col span={12}><label>{this.state.employeeDetails.group}</label></Col>
                    </div>
                    <div className="profile-label-light">
                        <Col span={8}><label>Employee Since</label></Col>
                        <Col span={12}><label>{this.state.employeeDetails.employeeSince}</label></Col>
                    </div>
                    <div className="profile-label-dark">
                        <Col span={8}><label>Extension</label></Col>
                        <Col span={12}><label>{this.state.employeeDetails.extension}</label></Col>
                    </div>
                    <div className="profile-label-light">
                        <Col span={8}><label>Location</label></Col>
                        <Col span={12}><label>{this.state.employeeDetails.location}</label></Col>
                    </div>
                    {/* <div className="profile-label-dark">
                        <Col span={8}><label>Blood Group</label></Col>
                        <Col span={12}><label>{this.state.employeeDetails.bloodGroup}</label></Col>
                    </div>
                    <div className="profile-label-light">
                        <Col span={8}><label>Birth Day</label></Col>
                        <Col span={12}><label>{this.state.employeeDetails.birthday}</label></Col>
                    </div> */}
                </Col>
                <Col span={8} offset={2}>
                    <div className="reportees">
                        <div className="direct-reportees-lbl"><label>Reporting Manager</label></div>
                        <div className="thumbnail"><Thumbnail employee={this.state.employeeDetails.manager}></Thumbnail></div>
                        <div className="direct-reportees-lbl"><label>Direct Reportees</label></div>
                        {directReportees}
                    </div>
                </Col>
            </div>
        )
    }
}