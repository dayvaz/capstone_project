import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateReviewRequest } from '../../requests/CreateReviewRequest'
import { createReview } from '../../businessLogic/reviews';
import { createLogger } from '../../utils/logger';
import { getUserId } from "../utils";
import * as middy from "middy";
import { cors } from "middy/middlewares";

const logger = createLogger('createReview');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event:', event);
  try {
    const newReview: CreateReviewRequest = JSON.parse(event.body)

    const userId = getUserId(event)
    const newItem = await createReview(newReview, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    };
  } catch (error) {
    logger.error("createReview call error ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error
      })
    }
  }
});

handler.use(
  cors({
    origin: "*",
    credentials: true
  })
);