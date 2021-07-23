import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatError } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import productsList from './products.json';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
  const asyncProductsData = Promise.resolve(productsList);
  const { id } = event.pathParameters;
  const products = await asyncProductsData;
  console.log(event);
  const product = products.find(p => p.id === id);
  if(product) {
    return formatJSONResponse(product);
  } else {
    return formatError(404, 'the requested product not found');
  }
}

export const main = middyfy(getProductsById);
