import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { get } from 'lodash';
import { logging, writeJSONToS3 } from '../../libs/utils';
import schema from './schema';

const clearElevators: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
    logging('AddElevator', 'Writing elevator list on S3');
    // @ts-ignore
    await writeJSONToS3([]);
    logging('AddElevator', 'Wrote elevator list on S3');

    return formatJSONResponse({
      response: { success: true, message: 'Successfully cleared' },
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: get(error, 'statusCode') || get(error, 'code') || 500,
      response: { success: false, message: get(error, 'message', 'Something went wrong') },
    });
  }
}

export const main = middyfy(clearElevators);
