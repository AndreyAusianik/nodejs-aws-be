import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatError } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { executeTransaction } from '@libs/pg-client';
import { Product } from '@models/product';

const createProduct: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
   
  try {
    console.log('executed with body:', event.body);

    const product = event.body as Product;;
    
    const [{rows:[{product_id}]}] = await executeTransaction([
      [
        `insert into products (product_title, product_description, product_price) values ($1, $2, $3) RETURNING product_id`,
        [product.title, product.description, product.price]
      ],
      [
        `insert into stocks (product_id, stock_count) values ($1, $2)`,
        ['%RESULT:1:product_id%', product.count]
      ]
    ]);
    console.log('everything worked');
    return formatJSONResponse({
      ...product,
      product_id,
    });
  } catch (e) {
    if(['23502'/*not_null_violation*/, '42804', /*datatype_mismatch*/].includes(e.code)) {
      return formatError(400, e.message);
    }
    return formatError(500, 'something went wrong. ' + e.message);
  }
}

export const main = middyfy(createProduct);
