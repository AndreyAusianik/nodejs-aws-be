import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import productsList from './products.json';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
  const asyncProductsData = Promise.resolve(productsList);
  const products = await asyncProductsData;
  return formatJSONResponse(products);
}

export const main = middyfy(getProductsList);
