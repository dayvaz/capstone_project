import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Segment,
} from 'semantic-ui-react'

import { deleteReview, getReviews, patchReview } from '../api/reviews-api'
import Auth from '../auth/Auth'
import { Review } from '../types/Review'
import 'semantic-ui-css/semantic.min.css'

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
//import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

interface ReviewsProps {
  auth: Auth
  history: History
  likedOnly: boolean
  bookName: string
  reviews: Review[]
  change: any,
  edit: any
}

interface ReviewsState {
  loadingReviews: boolean
}

export class Reviews extends React.PureComponent<ReviewsProps, ReviewsState> {
  state: ReviewsState = {
    loadingReviews: true
  }


  onEditButtonClick = (reviewId: string) => {
    this.props.edit(this.props.reviews.filter(review => review.reviewId == reviewId))
    this.props.history.push(`/reviews/${reviewId}/edit`)
  }


  onReviewDelete = async (reviewId: string) => {
    try {
      await deleteReview(this.props.auth.getIdToken(), reviewId)

      this.props.change(
        this.props.reviews.filter(review => review.reviewId != reviewId)
      )

    } catch {
      alert('Review deletion failed')
    }
  }

  onReviewCheck = async (pos: number) => {
    try {
      const review = this.props.reviews[pos]
      await patchReview(this.props.auth.getIdToken(), review.reviewId, {
        bookName: review.bookName,
        reviewText: review.reviewText,
        like: !review.like
      })

      this.props.change(
        update(this.props.reviews, {
          [pos]: { like: { $set: !review.like } }
        })
      )

    } catch {
      alert('Review Update failed')
    }
  }

  async componentDidMount() {
    try {
      const reviews = await getReviews(this.props.auth.getIdToken())

      this.props.change(reviews)

      this.setState({
        loadingReviews: false
      })
    } catch (e) {
      alert(`Failed to fetch review: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Book Reviews</Header>

        {this.renderReviews()}
      </div>
    )
  }

  renderReviews() {
    if (this.state.loadingReviews) {
      return this.renderLoading()
    }
    return this.renderReviewsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Reviews
        </Loader>
      </Grid.Row>
    )
  }

  renderReviewsList() {
    return (
      <Grid padded>
        { 
          this.props.reviews.map((review, pos) => {
          if ((!this.props.likedOnly||review.like)&&
              (this.props.bookName==='' || review.bookName.toLowerCase().includes(this.props.bookName.toLowerCase()))) {
          return (
            <Grid.Row key={review.reviewId} stretched >
            <Grid.Column width={3}>
                {review.attachmentUrl && (
                  <Image key={Date.now()} src={review.attachmentUrl} size="small" wrapped />
                )
                }
            </Grid.Column>
            <Grid.Column width={9}>
                {review.bookName}<br/> <br/> 
                {review.reviewText}
            </Grid.Column>
            <Grid.Column width={2}>

            </Grid.Column>
            <Grid.Column width={2}>

                  {review.like ? (
                    <Tooltip title="DisLike Book"  placement="left">
                      <IconButton onClick={() => this.onReviewCheck(pos)} >
                        <FavoriteIcon  color="primary" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Like Book"  placement="left">
                      <IconButton onClick={() => this.onReviewCheck(pos)} >
                        <FavoriteBorder color="primary" />
                      </IconButton>
                    </Tooltip>
                  )}<br/> <br/> <br/>
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(review.reviewId)}
                  >
                    <Icon name="pencil" />
                  </Button> 
                  <br/>
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onReviewDelete(review.reviewId)}
                  >
                    <Icon name="delete" />
                  </Button>
            </Grid.Column>
            <Grid.Column width={16}>
                  <Divider />
            </Grid.Column>
          </Grid.Row>

            )
          }else{
            return null
          }
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
