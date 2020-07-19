import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Auth from '../auth/Auth'
import { Review } from '../types/Review'




import dateFormat from 'dateformat'

import { createReview } from '../api/reviews-api'


enum AddState {
  NoAdd,
  AddingRecord,
}

interface AddReviewProps {
    auth: Auth,
    reviews: Review[],
    change: any
  }
  
  interface AddreviewState {
    bookName: any,
    reviewText: any,
    open: boolean,
    addState: AddState
  }
  
  export class AddReview extends React.PureComponent<
    AddReviewProps,
    AddreviewState
  > {
    state: AddreviewState = {
      bookName: undefined,
      reviewText: undefined,
      open: false,
      addState: AddState.NoAdd
    }


  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ bookName: event.target.value })
  }

  handleReviewTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ reviewText: event.target.value })
  }

  setAddState(addState: AddState) {
    this.setState({
      addState
    })
  }

  onReviewCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      //const dueDate = this.calculateDueDate()
      this.setAddState(AddState.AddingRecord)

      const newReview = await createReview(this.props.auth.getIdToken(), {
        bookName: this.state.bookName,
        reviewText: this.state.reviewText
      })

      this.props.change(
        [...this.props.reviews, newReview]
      )

      this.setState({ open: false });
    } catch {
      alert('Review creation failed')
    } finally {
      this.setAddState(AddState.NoAdd)
    }
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }



  render() {
    return (
        <div>

        <Tooltip title="Add Review!"  placement="top">
            <IconButton onClick={this.handleClickOpen} >
                <AddIcon />
            </IconButton>
        </Tooltip>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Review</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Share your ideas about books with others!
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Book Name"
                type="input"
                onChange={this.handleNameChange}
                fullWidth
            />
            
            <TextField
                margin="dense"
                id="review"
                label="Review"
                type="input"
                onChange={this.handleReviewTextChange}
                rows={5}
                rowsMax={10}
                multiline
                fullWidth
            />

            </DialogContent>
            <DialogActions>
            <Button onClick={this.handleClose} color="primary">
                Cancel
            </Button>
            {this.renderButton()}
            </DialogActions>
        </Dialog>
        </div>
    );
    }

    renderButton() {

      return (
        <div>
          {this.state.addState === AddState.AddingRecord && <p>Adding new review</p>}

          <Button onClick={this.onReviewCreate} color="primary" disabled={this.state.addState !== AddState.NoAdd}>
                Add Review
            </Button>
        </div>
      )
    }
}

export default AddReview; 