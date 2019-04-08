import React, { Component } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Button, Icon, Row, Col, Tooltip, message, Upload } from 'antd';
import * as apiUtil from '../utils/api-util';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';

const ButtonGroup = Button.Group;

export default class UploadPicture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            editor: null,
            preview: null,
            scale: 1,
            rotate: 0
        }
        this.rotateRight = this.rotateRight.bind(this);
        this.rotateLeft = this.rotateLeft.bind(this);
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleUploadImage = this.handleUploadImage.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.removeFile = this.removeFile.bind(this);
    }

    setEditorRef = (editor) => this.setState({ editor });

    handleNewImage = e => {
        this.setState({ image: e.target.files[0] })
    }

    rotateLeft() {
        this.setState((state) => {
            return {
                rotate: state.rotate - 90
            }
        });
    }

    rotateRight() {
        this.setState((state) => {
            return {
                rotate: state.rotate + 90
            }
        });
    }

    zoomIn() {
        this.setState((state) => {
            return {
                scale: state.scale + 0.1
            }
        })
    }

    zoomOut() {
        this.setState((state) => {
            return {
                scale: (state.scale - 0.1) >= 1 ? (state.scale - 0.1) : 1
            }
        })
    }

    handlePreview(data) {
        const img = this.state.editor.getImageScaledToCanvas().toDataURL()
        const rect = this.state.editor.getCroppingRect()
        this.setState({
            preview: {
                img,
                rect,
                scale: this.state.scale,
                width: this.state.width,
                height: this.state.height
            },
        })
    }

    handleSave() {
        const img = this.state.editor.getImage().toDataURL()
        apiUtil.uploadPicture(img, (err, result) => {
            if (err) {
                message.error('Upload Picture failed.')
                console.log(err);
                return;
            }
            message.success('Picture Uploaded successfully.');
            var currentUser = localStorage.getItem('directoryUser');
            var empId;
            if (currentUser) {
                currentUser = JSON.parse(currentUser);
                empId = currentUser['EMPLOYEE ID'];
            }
            this.props.history.push(`/home/${empId}`)
        })
    }

    handleUploadImage(info) {
        console.log(info.file, info.fileList);
        this.setState({ image: info.file.originFileObj })
    }

    handleDrop = acceptedFiles => {
        this.setState({ image: acceptedFiles[0] })
    }

    removeFile() {
        this.setState({ image: null, editor: null });
    }

    beforeUpload(file) {
        console.log('beforeupload file->', file);
        this.setState({ image: file });
        return false;
    }

    render() {
        return (
            <Row type="flex" justify="center" align="middle">
                <Col span={10}>
                    <Row type="flex" justify="center" align="middle" style={{ margin: '15px 0px' }}>
                        <input name="newImage" type="file" onChange={this.handleNewImage} />
                    </Row>
                    <Row type="flex" justify="center" align="middle">
                        <Dropzone
                            onDrop={this.handleDrop}
                            disableClick
                            multiple={false}
                            style={{ marginBottom: '35px' }}
                        >
                            {({ getRootProps, getInputProps, isDragActive }) => {
                                return (
                                    <div style={{ border: '1px solid grey', borderStyle: 'dotted' }} {...getRootProps()}
                                        className={classNames('dropzone', { 'dropzone--isActive': isDragActive })}>
                                        {
                                            this.state.image == null ?
                                                <p>Try dropping some files here.</p> : ''

                                        }
                                        <AvatarEditor
                                            ref={this.setEditorRef}
                                            image={this.state.image}
                                            width={250}
                                            height={250}
                                            border={50}
                                            color={[255, 255, 255, 0.6]} // RGBA
                                            scale={this.state.scale}
                                            rotate={parseFloat(this.state.rotate)}
                                        />
                                    </div>
                                )
                            }}

                        </Dropzone>
                    </Row>
                    <Row type="flex" justify="center" align="middle" style={{ margin: '15px 0px' }}>
                        <ButtonGroup>
                            <Tooltip placement="bottomRight" title={'Rotate Left'}>
                                <Button type="primary" icon="left-circle" size="large"
                                    style={{ fontSize: '20px' }}
                                    onClick={this.rotateLeft} /></Tooltip>
                            <Tooltip placement="bottomRight" title={'Zoom Out'}>
                                <Button type="primary" icon="minus-circle" size="large"
                                    style={{ fontSize: '20px' }}
                                    onClick={this.zoomOut} /></Tooltip>
                            <Tooltip placement="bottomRight" title={'Zoom In'}>
                                <Button type="primary" icon="plus-circle" size="large"
                                    style={{ fontSize: '20px' }}
                                    onClick={this.zoomIn} /></Tooltip>
                            <Tooltip placement="bottomRight" title={'Rotate Right'}>
                                <Button type="primary" icon="right-circle" size="large"
                                    style={{ fontSize: '20px' }}
                                    onClick={this.rotateRight} /></Tooltip>
                        </ButtonGroup>
                    </Row>
                </Col>
                <Col span={6} offset={1}>
                    <Row>
                        <Button block size='large' type="dashed" style={{ margin: '30px 0px' }} onClick={this.handlePreview}>Preview</Button>
                    </Row>
                    <Row>
                        <Button block size='large' type="primary" disabled={!this.state.image} onClick={this.handleSave}>Save</Button>
                    </Row>
                </Col>
                <Col span={4} offset={1}>
                    {this.state.preview && (
                        <img
                            src={this.state.preview.img}
                        />
                    )}
                </Col>
            </Row>
        );
    }
}