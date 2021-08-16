import {Client, QueryResult} from 'pg';

const { PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
    host: PG_HOST,
    port: +PG_PORT,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMills: 5000,
}


export const executeSelect = async (selectSql: string, params?: any[]):Promise<QueryResult>  => {
    const client = new Client(dbOptions);
    try {
        await client.connect();
        const result = await client.query(selectSql, params);
        return result;
        
    } catch(err) {
        console.error('error during database request executing:', err);
        throw err;
    } finally {
        client.end();
    }
}

export const executeTransaction  = async (transactions: [string, any[]?][]):Promise<QueryResult[]> => {
    const client = new Client(dbOptions);
    try {
        await client.connect();
        await client.query('BEGIN');
        const results = [];
        for(const [sql, params] of transactions) {
            '%RESULT:1:product_id%'
            const result = await client.query(sql, params.map(p => {
                if(typeof p !== 'string' || !p.match(/^%.+%$/)) {
                    return p;
                }
                const [_, idx, field] = p.slice(1, -1).split(':');
                return results[+idx - 1].rows[0][field];
            }));
            results.push(result);
        }
        await client.query('COMMIT');
        return results;
    } catch(err) {
        console.error('error during database request executing:', err);
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.end();
    }
}