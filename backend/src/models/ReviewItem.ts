export interface ReviewItem {
  userId: string
  reviewId: string
  createdAt: string
  bookName: string
  reviewText: string
  like: boolean
  attachmentUrl?: string
}
