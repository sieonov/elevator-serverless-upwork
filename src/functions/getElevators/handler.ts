import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { get } from 'lodash';

import { logging, getJSONFromS3, } from '../../libs/utils';
import schema from './schema';

const getElevators: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    logging('AddElevator', 'Fetching elevator list from S3');
    let elevators = await getJSONFromS3();
    elevators = JSON.parse(get(elevators, 'Body')) || [];
    logging('AddElevator', 'Fetched elevator list from S3');

    return formatJSONResponse({
      response: { success: true, data: elevators },
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: get(error, 'statusCode') || get(error, 'code') || 500,
      response: { success: false, message: get(error, 'message', 'Something went wrong') },
    });
  }
}

export const main = middyfy(getElevators);
