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


const Flexer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`

class ContentSelection extends Component {
    constructor(props) {
        super();
        const loadContent = 'https://api.joinoasys.org/GetContentsPreview';
        const that = this;
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
                content: json},
                () => this.setState({filteredContent: this.getContentForCategory(this.state.category)})))
}

    didChangeSearchText(textfield) {
        this.setState({
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



    //improve --> make a dictionary
    getContentForCategory(category) {
        if (category === "Recently Added" || category === "Featured") {
            return this.state.content
        }
        const keywords = getTagsForCategory(category);
        //confusing naming! tags sounds like array and state.content sounds like obj -- not array
        return this.state.content
            .filter(content => keywords
            //filter out when the tags string (??? should be array!) includes the keyword
                .filter(kw => content.tags.toLowerCase().includes(kw.toLowerCase()))
                //if there is an array with at least 1 match then .length returns true(=> don't filter) else false
                .length)
    }
    render(){
        let searchListContent = (
            <ListItem>
                 <ListItemText primary="No Contents Found" />
            </ListItem>
            )

        if (this.state.searchResults.length > 0) {
             searchListContent = this.state.searchResults.map(content => (
                  <ListItem button onClick={function(event) {event.preventDefault(); window.location.href = '/user/' + content.userId + '/' + content.contentId; }} key={content.contentId}>
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
                <Paper style={{margin:'16px', padding:'16px'}}>


                    <center>
                    <h2> Welcome to Oasys! </h2>
                    <p style={{maxWidth:'450px'}}>
                    Start your educational journey here. Search for topics you're interested in or select one of the personally curated contents below.
                    </p>

                    <FormControl style={{position:'absoulte', top:'0', left:'0', width:'15rem', padding:"0px 10px 0px 10px"}}>
                      <Select
                        onChange={this.handleCategoryChange.bind(this)}
                        displayEmpty
                        value={this.state.category}
                      >
                        <MenuItem value="Featured">
                          <em>Featured Content</em>
                        </MenuItem>
                        <MenuItem value="Recently Added">Recently Added</MenuItem>
                        <MenuItem value="Physics">Physics</MenuItem>
                        <MenuItem value="Chemistry">Chemistry</MenuItem>
                        <MenuItem value="Computer Science">Computer Science</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      id="search"
                      label="Search…"
                      style={{width:'15rem'}} 
                      type="text"
                      margin="normal"
                      onChange={this.didChangeSearchText.bind(this)}
                      fullWidth
                    />
                    <Popover
                      open={this.state.searchText.length>0}
                      anchorEl={this.state.searchAnchor}
                      onClose={this.closeSearchPopup.bind(this)}
                      disableAutoFocus={true}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                    <List>
                    {searchListContent}
                    </List>
                    </Popover>

                    </center>
                </Paper>
                <Flexer>
                    {this.state.content.length===0? (
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