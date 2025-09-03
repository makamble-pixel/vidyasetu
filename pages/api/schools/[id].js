import { ensureSchema, getPool } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
    try {
        await ensureSchema();
        const pool = await getPool();
        const { id } = req.query;
        const [rows] = await pool.query(
            'SELECT id, name, address, city, state, contact, email_id as email_id, image FROM schools WHERE id = ? LIMIT 1',
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'School not found' });
        }
        return res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Failed to fetch school' });
    }
}


