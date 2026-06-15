import 'dotenv/config'; 
import pg from 'pg';

const { Pool } = pg;


const pool = new Pool({
    database: process.env.DB_NAME
});

export const query = (text, params) => pool.query(text, params);