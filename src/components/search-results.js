import React, { Component } from 'react';
import SearchThumbnail from './search-thumbnail';
import { message } from 'antd';
import * as apiUtil from '../utils/api-util';

export default class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: []
        }
    }

    componentWillMount() {
        const searchParam = this.props.match.params.searchParam;
        apiUtil.getEmployees(searchParam, (err, result) => {
            if (err) {
                message.error("Couldn't fetch records");
                console.error(err);
                return;
            }
            if (result) {
                this.setState({ employees: result.employees });
            }
        })
    }

    render () {
        var searchResults = null;
        if (Object.keys(this.state.employees).length === 0 && this.state.employees.constructor === Object) {
            searchResults = (
                <label>No records found</label>
            )
        } else {
            searchResults = this.state.employees.map((employee) => {
                return <SearchThumbnail key={employee.employeeId} employee={employee}></SearchThumbnail>
            })
        }
        
        return (
            <div>{searchResults}
            </div>
        )
    }
}