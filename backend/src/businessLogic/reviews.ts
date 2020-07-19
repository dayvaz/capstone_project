import * as uuid from 'uuid'

import { ReviewItem } from '../models/ReviewItem'
import { ReviewUpdate } from '../models/ReviewUpdate'
import { ReviewAccess } from '../dataLayer/reviewsAccess'
import { S3Access } from '../dataLayer/s3Access'
import { CreateReviewRequest } from '../requests/CreateReviewRequest'
import { UpdateReviewRequest } from '../requests/UpdateReviewRequest'

const reviewAccess = new ReviewAccess()
const s3Access = new S3Access()

export async function getAllReviewsByUserId(userId: string): Promise<ReviewItem[]> {
  return await reviewAccess.getAllReviewsByUserId(userId)
}

export async function createReview(
  createReviewRequest: CreateReviewRequest,
  userId: string
): Promise<ReviewItem> {

  const reviewId = uuid.v4()

  return await reviewAccess.createReview({
    createdAt: new Date().toISOString(),
    like: false,
    reviewText: createReviewRequest.reviewText,
    bookName: createReviewRequest.bookName,
    reviewId,
    userId,
    attachmentUrl: ""
  })
}

export async function reviewExists(
  reviewId: string
): Promise<boolean> {

  return await reviewAccess.reviewExists (reviewId)
}

export async function getReviewItem(
  reviewId: string
): Promise<ReviewItem> {

  return await reviewAccess.getReviewItem(reviewId)
}

export async function updateReview(
    reviewId: string,
    userId: string,
    updateReviewRequest: UpdateReviewRequest
  ): Promise<ReviewUpdate> {
  
    return await reviewAccess.updateReview(reviewId,userId,updateReviewRequest)
}

export async function deleteReview(
    reviewId: string,
    userId: string
  ): Promise<void> {
  
    return await reviewAccess.deleteReview(reviewId,userId)
}

export async function  updateReviewUrl(
  reviewId: string, 
  userId: string,
  attachmentUrl: string
  ): Promise<void> {
   return await reviewAccess.updateReviewUrl(reviewId, userId, attachmentUrl)
}


export function getUploadUrl (reviewId: string) {
   return s3Access.getUploadUrl(reviewId)
} 
