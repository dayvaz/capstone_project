/**
 * Fields in a request to update a single REVIEW item.
 */
export interface UpdateReviewRequest {
  bookName: string
  reviewText: string
  like: boolean
}