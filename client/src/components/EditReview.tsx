import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, patchReview } from '../api/reviews-api'
import { Review } from '../types/Review'
import TextField from '@material-ui/core/TextField';

enum UploadState {
  NoUpload,
  UpdatingReview,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditReviewProps {
  match: {
    params: {
      reviewId: string
    }
  }
  auth: Auth
  reviewToEdit: Review
}

interface EditReviewState {
  file: any
  uploadState: UploadState
  newBookName: string
  newReviewText: string
  like: boolean
}

export class EditReview extends React.PureComponent<
  EditReviewProps,
  EditReviewState
> {
  state: EditReviewState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    newBookName: '',
    newReviewText: '',
    like: false
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      this.setUploadState(UploadState.UpdatingReview)

      await patchReview(this.props.auth.getIdToken(), this.props.match.params.reviewId, {
        bookName: this.state.newBookName? this.state.newBookName: this.props.reviewToEdit.bookName,
        reviewText: this.state.newReviewText? this.state.newReviewText:this.props.reviewToEdit.reviewText,
        like: this.props.reviewToEdit.like
      })


      if (!this.state.file) {
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.reviewId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)



      alert('File was uploaded!')
    } catch (e) {
      alert('Could not edit: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBookName: event.target.value })
  }

  handleReviewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewText: event.target.value })
  }


  render() {

    return (
      <div>
        <h1>Edit Review</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Book Name: </label>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                type="input"
                onChange={this.handleNameChange}
                 value={this.state.newBookName?this.state.newBookName:this.props.reviewToEdit.bookName}
                fullWidth
            />

          </Form.Field>
          <Form.Field>
            <label>Review Text: </label>
            <TextField
              margin="dense"
              id="review"
              type="input"
              onChange={this.handleReviewChange}
              value={this.state.newReviewText?this.state.newReviewText:this.props.reviewToEdit.reviewText}
              rows={5}
              rowsMax={10}
              multiline
              fullWidth
          />
          </Form.Field>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.UpdatingReview && <p>Updating name and text</p>}
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Edit Review
        </Button>
      </div>
    )
  }
}
