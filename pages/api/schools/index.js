import { ensureSchema, getPool } from '@/lib/db';
import { saveLocalImage } from '@/lib/fileUpload';
import formidable from 'formidable';

export const config = { api: { bodyParser: false } };

function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(num) {
	return /^\d{7,15}$/.test(num);
}

async function parseForm(req) {
	const form = formidable({ multiples: false, maxFiles: 1, allowEmptyFiles: false });
	return new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) return reject(err);
			resolve({ fields, files });
		});
	});
}

export default async function handler(req, res) {
	await ensureSchema();
	const pool = await getPool();

	if (req.method === 'GET') {
		try {
			const { search = '', city = '', state = '', limit = '20', offset = '0' } = req.query || {};
			const whereClauses = [];
			const params = [];

			if (search) {
				whereClauses.push('(name LIKE ? OR address LIKE ? OR city LIKE ? OR state LIKE ?)');
				const like = `%${search}%`;
				params.push(like, like, like, like);
			}
			if (city) {
				whereClauses.push('city = ?');
				params.push(city);
			}
			if (state) {
				whereClauses.push('state = ?');
				params.push(state);
			}

			const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

			const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
			const offsetNum = Math.max(0, parseInt(offset, 10) || 0);

			const [rows] = await pool.query(
				`SELECT id, name, address, city, state, image FROM schools ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
				[...params, limitNum, offsetNum]
			);

			const [[{ total }]] = await pool.query(
				`SELECT COUNT(*) as total FROM schools ${whereSql}`,
				params
			);

			return res.status(200).json({ success: true, data: rows, total });
		} catch (err) {
			console.error(err);
			return res.status(500).json({ success: false, message: 'Failed to fetch schools' });
		}
	}

	if (req.method === 'POST') {
		let savedPath;
		try {
			const { fields, files } = await parseForm(req);
			const name = String(fields.name || '').trim();
			const address = String(fields.address || '').trim();
			const city = String(fields.city || '').trim();
			const state = String(fields.state || '').trim();
			const contact = String(fields.contact || '').trim();
			const email_id = String(fields.email_id || '').trim();
			const imageFile = files.image;

			if (!name || !address || !city || !state || !contact || !email_id || !imageFile) {
				return res.status(400).json({ success: false, message: 'All fields are required' });
			}
			if (!isValidEmail(email_id)) {
				return res.status(400).json({ success: false, message: 'Invalid email format' });
			}
			if (!isValidPhone(contact)) {
				return res.status(400).json({ success: false, message: 'Invalid contact number' });
			}

			// Enforce unique email
			const [existing] = await pool.query('SELECT id FROM schools WHERE email_id = ? LIMIT 1', [email_id]);
			if (existing.length > 0) {
				return res.status(409).json({ success: false, message: 'Email already exists' });
			}

			// Enforce unique phone number
			const [existingPhone] = await pool.query('SELECT id FROM schools WHERE contact = ? LIMIT 1', [contact]);
			if (existingPhone.length > 0) {
				return res.status(409).json({ success: false, message: 'Phone number already exists' });
			}

			const { relative } = await saveLocalImage(Array.isArray(imageFile) ? imageFile[0] : imageFile);
			savedPath = relative;

			await pool.execute(
				'INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
				[name, address, city, state, contact, email_id, relative]
			);

			return res.status(201).json({ success: true, message: 'School added successfully' });
		} catch (err) {
			console.error(err);
			return res.status(500).json({ success: false, message: 'Failed to add school' });
		}
	}

	return res.status(405).json({ success: false, message: 'Method not allowed' });
} 