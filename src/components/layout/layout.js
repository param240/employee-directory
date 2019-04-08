import React, { Component } from 'react';
import { Layout, Menu, Icon, Input, Col } from 'antd';
import './layout.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import Profile from '../profile';
import SearchResults from '../search-results';
import { Link } from 'react-router-dom';
import UploadPicture from '../upload-picture';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const Search = Input.Search;

export default class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.onEmployeeSearch = this.onEmployeeSearch.bind(this);
  }

  handleSignOut(e) {
    if (e.key === 'logout') {
      localStorage.removeItem('directoryUser');
    this.props.history.push('/login');
    }
  }

  onEmployeeSearch(value) {
    this.props.history.push(`/search/${value}`);
  }

  handleClick(empId) {
    this.props.history.push(`/home/${empId}`)
  }

  render() {
    var currentUser = localStorage.getItem('directoryUser');
    var empId;
    if (currentUser) {
      currentUser = JSON.parse(currentUser);
      empId = currentUser['EMPLOYEE ID'];
    }
    return (
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <div className="app-title"><label style={{ fontSize: '20px' }}><Link to={`/home/${empId}`} onClick={this.handleClick.bind(this, empId)}
            className="thumbnail-link"><u><b>Employee Directory</b></u></Link></label></div>
          <Col span={10} offset={4}><div className="app-searchbar"><Search onSearch={this.onEmployeeSearch} style={{ backgroundColor: '#f7f7f7', height: 45 }} placeholder="Search by Name, Designation, Group, Employee Id or Email Id" /></div></Col>
          <div className="rightWarpper">
            <Menu mode="horizontal"
              onClick={this.handleSignOut}
            >
              <SubMenu
                style={{
                  float: 'right'
                }}
                title={<span>
                  <Icon type="user" />
                  {currentUser && currentUser['FIRST NAME']}
                </span>}
              >
                <Menu.Item key="logout" style={{ padding: '0 20px' }}>
                  Sign out
            </Menu.Item>
              </SubMenu>
            </Menu></div>
        </Header>
        <Layout>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Switch>
              <Route path='/home/:employeeId' render={props => {
                const employeeId = props.match.params.employeeId;
                return (
                  <Profile
                    key={`employeeId=${employeeId}`}
                    {...props}
                  />
                );
              }} />
              <Route path='/search/:searchParam' render={props => {
                const searchParam = props.match.params.searchParam;
                return (
                  <SearchResults
                    key={`serachParam=${searchParam}`}
                    {...props}
                  />
                );
              }} />
              <Route path="/uploadpicture" component={UploadPicture} />
              <Route path="/" render={props => {
                return (
                  <Profile
                    key={`employeeId=${empId}`}
                    {...props}
                  />
                );
              }}  />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}