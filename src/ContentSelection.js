import React from 'react';
import {Component} from 'react';
import styled from "styled-components"
import SimpleMediaCard from "./SimpleMediaCard"
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import {substringInObjCount} from "./utils";
import api from './tools'
import {getTagsForCategory} from "./utils";
import {Unwrap, Wrap} from "./utils"
import ErrorLoadingContentPage from "./ErrorLoadingContentPage"
import HorizontalScroll from './horizontal_scroll/HorizontalScroll'
import cover from './images/cover.png'

const Flexer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`

class ContentSelection extends Component {
    constructor(props) {
        super();
        this.state = {
            content: [],
            filteredContent: [],
            searchText: '',
            searchAnchor: null,
            searchResults: [],
            category: 'Featured'
            // isLoading: true
        }

        api.getContentsPreview()
            .then(json => this.setState({
                content: json || "errorLoadingContent"},
                () => this.setState({filteredContent: this.getContentForCategory(this.state.category)})))
}

    didChangeSearchText(textfield) {
        this.state.content==="errorLoadingContent"
        ? null
        : this.setState({
            searchText: textfield.target.value,
            searchAnchor: textfield.currentTarget,
            searchResults: this.state.content.filter(content => substringInObjCount(content, textfield.target.value) > 0)
          })
    }

    closeSearchPopup() {
        this.setState({
            searchText: ''
        })
    }

    handleCategoryChange(event) {
        this.setState({
         category: event.target.value,
         filteredContent: this.getContentForCategory(event.target.value)
     });
    }

    getContentForCategory(category) {
        if (category === "Recently Added" || category === "Featured") {
            return this.state.content
        }
        const keywords = getTagsForCategory(category);
        //confusing naming! tags sounds like array and state.content sounds like obj -- not array

        function stringHasSubstring(str, substr) {
            return str.toLowerCase().includes(substr.toLowerCase())
        }
        return this.state.content
            .filter(content => keywords.filter(kw => stringHasSubstring(content.tags, kw) ).length)
            //filter out when the tags string (??? should be array!) includes the keyword

                //if there is an array with at least 1 match then .length returns true(=> don't filter) else false

    }
    render(){
        let searchListContent = (
            <ListItem>
                 <ListItemText primary="No Contents Found" />
            </ListItem>
            )

        if (this.state.searchResults.length > 0) {
             searchListContent = this.state.searchResults.map(content => (
                  <ListItem button onClick={function(event) {event.preventDefault(); window.location.href = '/user/' + Wrap(content.userId) + '/' + Wrap(content.contentId); }} key={content.contentId}>
                    <Avatar alt="Remy Sharp" src={content.picture} />
                    <ListItemText primary={content.title} secondary={"Created by " + content.userId}/>
                  </ListItem>
             ))
        }

        // no content was loaded form the server at all
        if (!this.state.content) {
            searchListContent = <CircularProgress style={{ color: 'orange' }} thickness={7} />
        }


        return (
            <div>
                <div style={{margin:'16px', padding:'16px', display:"flex", justifyContent:"center"}}>
                  <img src={cover} style={{width:"80%",height:"100%"}}/>
                </div>
                <HorizontalScroll/>
                <br/>

                <Flexer>
                    {
                      this.state.content==="errorLoadingContent"
                      ? <ErrorLoadingContentPage/>
                      : this.state.content.length===0? (
                            <CircularProgress style={{ color: 'orange' }} thickness={7} />
                        ) : (
                            this.state.filteredContent.map((d, i) => <SimpleMediaCard key={i} contentData={d}/>)
                        )
                    }
                </Flexer>
            </div>
        )
    }
}

export default ContentSelection;