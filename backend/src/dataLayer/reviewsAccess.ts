import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ReviewItem } from '../models/ReviewItem'
import { ReviewUpdate } from '../models/ReviewUpdate'
import { createLogger } from "../utils/logger"


const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('reviewAccess');



export class ReviewAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly reviewsTable = process.env.REVIEWS_TABLE,
    private readonly reviewsTableIndexId = process.env.REVIEW_ID_INDEX,) {
  }

  async getAllReviewsByUserId(userId: String): Promise<ReviewItem[]> {
    logger.info('Getting all reviews')
    try{
      const result = await this.docClient.query({
          TableName: this.reviewsTable,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
              ':userId': userId
          }
      }).promise()

      return Promise.resolve(result.Items as ReviewItem[]);
    } catch (error) {
      return Promise.reject(error);
    }
  }


  async createReview(review: ReviewItem): Promise<ReviewItem> {
    try {
        logger.info("Creating a new review", review);

        const params: DocumentClient.PutItemInput = {
            TableName: this.reviewsTable,
            Item: review
        };

        await this.docClient.put(params).promise();
        return Promise.resolve(review as ReviewItem);
    } catch (error) {
        return Promise.reject(error);
    }
}


  async updateReviewUrl(reviewId: string, userId: string, attachmentUrl: string): Promise<void> {
    try {
        logger.info(`Updating attachment url of the review: ${reviewId} to url: ${attachmentUrl}`)

        const params: DocumentClient.UpdateItemInput = {
            TableName: this.reviewsTable,
            Key: {
              "userId": userId,
              "reviewId": reviewId
            },
            UpdateExpression: "set #a = :a",
            ExpressionAttributeNames: {
                '#a': 'attachmentUrl',
            },
            ExpressionAttributeValues: {
                ":a": attachmentUrl
            }
        };

        await this.docClient.update(params).promise();
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
  }

  async updateReview(reviewId: string, userId: string, item: ReviewUpdate): Promise<ReviewUpdate> {
    try {
        logger.info(`Updating review with id: ${reviewId}`)

        const params: DocumentClient.UpdateItemInput = {
            TableName: this.reviewsTable,
            Key: {
                "userId": userId,
                "reviewId": reviewId
            },
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {
                '#a': 'bookName',
                '#b': 'reviewText',
                '#c': 'like'
            },
            ExpressionAttributeValues: {
                ":a": item.bookName,
                ":b": item.reviewText,
                ":c": item.like
            },
            ReturnValues: "UPDATED_NEW"
        }

        const updatedItem = await this.docClient.update(params).promise()
        return Promise.resolve(updatedItem.Attributes as ReviewUpdate)
    } catch (error) {
        return Promise.reject(error);
    }
  }

  async deleteReview(reviewId: string, userId: string): Promise<void> {
    try {
        logger.info(`Deleting review with id: ${reviewId}`);

        const params: DocumentClient.DeleteItemInput = {
            TableName: this.reviewsTable,
            Key: {
                "userId": userId,
                "reviewId": reviewId
            }
        };

        await this.docClient.delete(params).promise();
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
  }

  

  async  getReviewItem(reviewId: string): Promise<ReviewItem>  {
    logger.info('Checking if review exists')
    try {
      const result = await this.docClient.query({
          IndexName: this.reviewsTableIndexId,
          TableName: this.reviewsTable,
          KeyConditionExpression: "reviewId = :reviewId",
          ExpressionAttributeValues: {
              ':reviewId': reviewId
          }
        }).promise();

        logger.info('getReviewItem result: ', result)

        if (result.Items && result.Items.length) {
          return Promise.resolve(result.Items[0] as ReviewItem);
        }else{
          return Promise.resolve(undefined);
        }
      }catch (error) {
        return Promise.reject(error);
    }
  }


  async  reviewExists(reviewId: string): Promise<boolean> {
    logger.info('Checking if review exists')

    const result = await this.docClient.query({
        IndexName: this.reviewsTableIndexId,
        TableName: this.reviewsTable,
        KeyConditionExpression: "reviewId = :reviewId",
        ExpressionAttributeValues: {
            ':reviewId': reviewId
        }
      }).promise();
  
    logger.info('Get review: ', result)
    return !!result.Items
  }

}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
