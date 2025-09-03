import mysql from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Ensure .env.local is loaded when running in Node context
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
dotenv.config({ path: path.join(projectRoot, '.env.local') });

let pool;

export async function getPool() {
	if (!pool) {
		pool = mysql.createPool({
			host: process.env.DB_HOST || 'localhost',
			user: process.env.DB_USER || 'root',
			password: process.env.DB_PASSWORD || '',
			database: process.env.DB_NAME || 'schooldb',
			connectionLimit: 10,
			multipleStatements: false,
		});
	}
	return pool;
}

export async function ensureSchema() {
	const host = process.env.DB_HOST || 'localhost';
	const user = process.env.DB_USER || 'root';
	const password = process.env.DB_PASSWORD || '';
	const dbName = process.env.DB_NAME || 'schooldb';
	const connection = await mysql.createConnection({ host, user, password });
	try {
		await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
	} finally {
		await connection.end();
	}
	const poolLocal = await getPool();
	await poolLocal.query(`CREATE TABLE IF NOT EXISTS schools (
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

	// Insert dummy data if table is empty
	await insertDummyDataIfEmpty(poolLocal);
}

async function insertDummyDataIfEmpty(pool) {
	try {
		const [rows] = await pool.query('SELECT COUNT(*) as count FROM schools');
		if (rows[0].count === 0) {
			const dummySchools = [
				{
					name: "St. Xavier's High School",
					address: "123 MG Road",
					city: "Mumbai",
					state: "Maharashtra",
					contact: "9876543210",
					email_id: "stxaviers@example.com",
					image: "https://images.pexels.com/photos/33690988/pexels-photo-33690988.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
				},
				{
					name: "Vidya Mandir Public School",
					address: "45 Ghodbunder Road",
					city: "Thane",
					state: "Maharashtra",
					contact: "9988776655",
					email_id: "vidyamandir@example.com",
					image: "https://images.pexels.com/photos/207729/pexels-photo-207729.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
				},
				{
					name: "New Horizon English School",
					address: "Plot 12, Panchpakhadi",
					city: "Mumbai",
					state: "Maharashtra",
					contact: "9123456780",
					email_id: "newhorizon@example.com",
					image: "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
				},
				{
					name: "Blooming Buds International",
					address: "Sector 5, Kalwa",
					city: "Thane",
					state: "Maharashtra",
					contact: "9812345678",
					email_id: "bloomingbuds@example.com",
					image: "https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
				},
				{
					name: "Little Stars Academy",
					address: "Near Station Road",
					city: "Mumbai",
					state: "Maharashtra",
					contact: "9765432109",
					email_id: "littlestars@example.com",
					image: "https://images.pexels.com/photos/17144608/pexels-photo-17144608.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
				}
			];

			for (const school of dummySchools) {
				await pool.execute(
					'INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
					[school.name, school.address, school.city, school.state, school.contact, school.email_id, school.image]
				);
			}
			console.log('✅ Dummy school data inserted successfully');
		}
	} catch (error) {
		console.error('❌ Error inserting dummy data:', error);
	}
} 