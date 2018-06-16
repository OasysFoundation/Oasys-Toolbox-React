import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from "styled-components"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Button from '@material-ui/core/Button';

//next / previous Buttons

const Preview = (props) => <ReactQuill value={props.content || "no content"} readOnly={true}  theme={null}/>;

export default Preview;