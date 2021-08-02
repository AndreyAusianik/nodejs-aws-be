import 'source-map-support/register';

import { formatError, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { executeSelect } from '@libs/pg-client';
import { middyfy } from '@libs/lambda';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
  try {
    const {rows} = await executeSelect(`select 
      products.product_id as product_id,
      products.product_title as title,
      products.product_description as description,
      products.product_price as price,
      stocks.stock_count as count from
      products inner join stocks on (products.product_id=stocks.product_id)`);
      return formatJSONResponse(rows);
  } catch (e) {
    console.log('error occured')
    return formatError(500, 'something went wrong. ');
  }
  
}

export const main = middyfy(getProductsList);
