import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatError } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { executeSelect } from '@libs/pg-client';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
   
  try {
    const { id } = event.pathParameters;
    console.log('executed with id = ', id);
    const {rows} = await executeSelect(`select 
      products.product_id as product_id,
      products.product_title as title,
      products.product_description as description,
      products.product_price as price,
      stocks.stock_count as count from
      products inner join stocks on (products.product_id=stocks.product_id)
      where products.product_id = $1`, [id]);
      if(rows[0]) {
        return formatJSONResponse(rows[0]);
      } else {
        return formatError(404, 'the requested product not found');
      }
  } catch (e) {
    console.log('error occured')
    return formatError(500, 'something went wrong. ');
  }
}

export const main = middyfy(getProductsById);
