import React, { Component } from 'react';
import { Button, Form, Icon, Input, Row, Col } from 'antd';
import * as authUtil from '../utils/auth-util';
import { config } from '../config/app-config';

const FormItem = Form.Item;

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false,
            isLoginFailed: false,
            errMessage: '',
        };
        this.handleSignin = this.handleSignin.bind(this);
    }

    handleSignin() {
        this.props.form.validateFieldsAndScroll((err, userObj) => {
            if (!err) {
                var email = userObj.emailId.split("@")[0];
                email = email + config.defaultDomain;
                email = email.toLowerCase();
                userObj.emailId = email;
                authUtil.authenticateUser(userObj, (err, user) => {
                    if (err) {
                        console.log(err)
                        this.setState({
                            errMessage: 'Incorrect Email Id or Password',
                            isLoginFailed: true,
                        });
                        return;
                    } else {
                        this.setState({
                            isLoginFailed: false,
                        });
                        this.props.history.push('/home/' + user['EMPLOYEE ID']);
                    }
                })
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        var err = null;
        if (this.state.isLoginFailed) {
            err = <label style={{ color: 'red' }}>{this.state.errMessage}</label>
        }
        return (
            <div className={'login-form'}>
            <Row>
                <Col span={10} offset={7}>
                    <div className='login-container'>
                    <div className="login-text-container"><label className="login-title">Employee Directory</label></div>
                        {err}
                        <Form>
                            <FormItem>
                                {getFieldDecorator('emailId', {
                                    rules: [{ required: true, message: 'Please enter your User Id' }]
                                })(
                                    <Input prefix={<Icon type='user' style={{ color: 'rgba(10,10,210,.25)' }} />}
                                        placeholder='User Id' autoComplete="username" addonAfter={config.defaultDomain}></Input>
                                )
                                }
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please enter your Password' }]
                                })(
                                    <Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type='password' placeholder='Password' autoComplete="current-password"
                                        onPressEnter={this.handleSignin}></Input>
                                )
                                }
                            </FormItem>
                            <FormItem>
                                <Button type="primary" className="login-form-button" onClick={this.handleSignin}>Login</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Col>
                </Row>
            </div>
        )
    }
}

Login = Form.create({})(Login);