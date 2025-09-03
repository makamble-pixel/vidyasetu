/* Dev bootstrap: ensure DB, table, and local upload dir, then run Next dev */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });
const mysql = require('mysql2/promise');

async function ensureUploadDir() {
	const dir = path.join(process.cwd(), 'public', 'schoolImages');
	await fs.promises.mkdir(dir, { recursive: true });
}

async function ensureDatabaseAndTable() {
	const host = process.env.DB_HOST || 'localhost';
	const user = process.env.DB_USER || 'root';
	const password = process.env.DB_PASSWORD || '';
	const dbName = process.env.DB_NAME || 'schooldb';

	// Connect without database to create it if needed
	const connection = await mysql.createConnection({ host, user, password, multipleStatements: true });
	try {
		await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
	} finally {
		await connection.end();
	}

	// Now ensure table exists
	const pool = await mysql.createPool({ host, user, password, database: dbName });
	try {
		await pool.query(`CREATE TABLE IF NOT EXISTS schools (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name TEXT NOT NULL,
			address TEXT NOT NULL,
			city TEXT NOT NULL,
			state TEXT NOT NULL,
			contact BIGINT NOT NULL,
			email_id TEXT NOT NULL,
			image TEXT NOT NULL,
			INDEX (id)
		)`);
	} finally {
		await pool.end();
	}
}

async function main() {
	try {
		await ensureUploadDir();
		await ensureDatabaseAndTable();
	} catch (err) {
		console.error('Startup error:', err);
		process.exit(1);
	}

	const child = spawn('npx', ['next', 'dev'], { stdio: 'inherit', shell: true });
	child.on('exit', (code) => process.exit(code ?? 0));
}

main(); 