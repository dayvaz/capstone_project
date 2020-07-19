import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllReviewsByUserId } from '../../businessLogic/reviews';
import { createLogger } from '../../utils/logger';
import { getUserId } from "../utils";
import * as middy from "middy";
import { cors } from "middy/middlewares";

const logger = createLogger('getReviews');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info("Processing event", event);
    const userId = getUserId(event)
    const reviews = await getAllReviewsByUserId(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: reviews
      })
    };
  } catch (error) {
    logger.error("getAllReviewsByUserId call error ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error
      })
    };
  }
});

handler.use(
  cors({
    origin: "*"
  })
);

