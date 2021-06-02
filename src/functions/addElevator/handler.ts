import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { get, isEmpty } from 'lodash';
import moment from 'moment-timezone';

import { logging, getJSONFromS3, writeJSONToS3 } from '../../libs/utils';
import schema from './schema';

const MAX_COUNT = 5000;

const addElevator: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  logging('AddElevator', 'Parsing request body');
  const body = get(event, 'body');

  console.log('body', body);

  if (isEmpty(body)) {
    return formatJSONResponse({
      statusCode: 400,
      response: { success: false, message: 'Please specify all of required fields' },
    });
  }
  logging('AddElevator', 'Parsed request body');

  try {
    const sn = get(body, 'sn');
    const firmwareVersion = get(body, 'firmwareVersion');
    const factoryCode = get(body, 'factoryCode');
    const device = get(body, 'device');
    const carDoorOpenings = get(body, 'carDoorOpenings');
    const link = get(body, 'link');
    const date = moment().tz('America/New_York').format('yyyy-MM-DD');
    const time = moment().tz('America/New_York').format('hh:mm:ss');
    logging('AddElevator', 'Fetching elevator list from S3');
    let elevators = await getJSONFromS3();
    elevators = JSON.parse(get(elevators, 'Body')) || [];
    logging('AddElevator', 'Fetched elevator list from S3');

    logging('AddElevator', 'Writing elevator list on S3');
    // @ts-ignore
    if (elevators.length >= MAX_COUNT) {
      // @ts-ignore
      elevators.shift();
    }
    // @ts-ignore
    elevators.push({ sn, firmwareVersion, factoryCode, device, carDoorOpenings, date, time, link });
    await writeJSONToS3(elevators);
    logging('AddElevator', 'Wrote elevator list on S3');

    return formatJSONResponse({
      response: { success: true, message: 'Successfully created' },
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: get(error, 'statusCode') || get(error, 'code') || 500,
      response: { success: false, message: get(error, 'message', 'Something went wrong') },
    });
  }
}

export const main = middyfy(addElevator);
