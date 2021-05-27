import { get } from 'lodash';
const AWS = require('aws-sdk');

export const logging = (fn: string, msg: string, tabs?: number) =>
  (console.log(`${fn}:${'  '.repeat(tabs || 2)}${msg}`));

export const getTime = (dateTime) => (dateTime.toTimeString().split(' ')[0])

export const getDate = (dateTime) => {
  const year = dateTime.getFullYear();
  let month = '00' + (dateTime.getMonth() + 1);
  month = month.substring(month.length - 2);
  let date = '00' + dateTime.getDate();
  date = date.substring(date.length - 2);
  return `${year}-${month}-${date}`;
}

const S3  = new AWS.S3();
export const writeJSONToS3 = (objData) => (
  new Promise(async (resolve, reject) => {
    try {
      const result = await S3.putObject({
        Bucket: 'elevator-data-json',
        Key: 'data.json',
        Body: JSON.stringify(objData),
        ContentType: 'application/json'
      }).promise();
      resolve(result);
    } catch (error) {
      reject({
        statusCode: get(error, 'statusCode', 500),
        message: get(error, 'message', 'Something went wrong'),
      })
    }
  })
)

export const getJSONFromS3 = () => (
  new Promise(async (resolve, reject) => {
    try {
      const result = await S3.getObject({
        Bucket: 'elevator-data-json',
        Key: 'data.json',
      }).promise();
      resolve(result);
    } catch (error) {
      reject({
        statusCode: get(error, 'statusCode', 500),
        message: get(error, 'message', 'Something went wrong'),
      })
    }
  })
)
