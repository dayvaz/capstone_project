export interface Review {
  reviewId: string
  createdAt: string
  bookName: string
  reviewText: string
  like: boolean
  attachmentUrl?: string
}
