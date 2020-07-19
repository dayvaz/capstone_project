import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment, Input } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditReview } from './components/EditReview'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Reviews } from './components/Reviews'
import { AddReview } from './components/AddReview'
import { Review } from './types/Review'

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
  likedOnly: boolean,
  bookName: string,
  reviews: Review[]
  reviewToEdit: Review[]
}

export default class App extends Component<AppProps, AppState> {
  state: AppState = {
    likedOnly: false,
    bookName: '',
    reviews: [],
    reviewToEdit: []
  }



  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.reviewListChanged = this.reviewListChanged.bind(this)
    this.reviewToEditListChanged = this.reviewToEditListChanged.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  likeButtonPressed = () => {
    this.setState({ likedOnly: !this.state.likedOnly })
  }

  reviewListChanged = (reviews: Review[]) => {
    this.setState({ reviews: reviews })
  }

  reviewToEditListChanged = (reviewToEdit: Review[]) => {
    this.setState({ reviewToEdit: reviewToEdit })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ bookName: event.target.value })
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>


        <Menu.Menu>{this.addButton()}</Menu.Menu>
        <Menu.Menu>{this.likeButton()}</Menu.Menu>

        <Menu.Menu position='right'>{this.searchField()}</Menu.Menu>
        
        <Menu.Menu>{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  

  addButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="Add" >
            <AddReview change={this.reviewListChanged} auth={this.props.auth} reviews={this.state.reviews}/>
        </Menu.Item>
      )
    } else {
      return null
    }
  }


  likeButton() {
    if (this.props.auth.isAuthenticated()) {
      if (this.state.likedOnly) {
        return(
          <Menu.Item name="Like" >
            <Tooltip title="List My Reviews"  placement="left">
              <IconButton onClick={this.likeButtonPressed} >
                <FavoriteIcon  color="primary" />
              </IconButton>
            </Tooltip>
          </Menu.Item>
        )
      }else{
        return (
          <Menu.Item name="Like" >
            <Tooltip title="List Liked Reviews"  placement="left">
              <IconButton onClick={this.likeButtonPressed} >
                <FavoriteBorder color="primary" />
              </IconButton>
            </Tooltip>
          </Menu.Item>
        )
      }
    } else {
      return null
    }
  }

  searchField() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item >
            <Input icon='search' onChange={this.handleNameChange} placeholder='Search...' />
        </Menu.Item>
      )
    } else {
      return null
    }
  }



  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Reviews {...props} change={this.reviewListChanged} edit={this.reviewToEditListChanged} auth={this.props.auth} likedOnly={this.state.likedOnly} bookName={this.state.bookName} reviews={this.state.reviews}/>
          }}
        />

        <Route
          path="/reviews/:reviewId/edit"
          exact
          render={props => {
            return <EditReview {...props} auth={this.props.auth}  reviewToEdit={this.state.reviewToEdit[0]}/>
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
