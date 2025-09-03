import fs from 'fs';
import path from 'path';

function sanitizeFilename(name) {
	return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function saveLocalImage(file) {
	const uploadsDir = path.join(process.cwd(), 'public', 'schoolImages');
	await fs.promises.mkdir(uploadsDir, { recursive: true });
	const original = file.originalFilename || 'upload.jpg';
	const ext = path.extname(original) || '.jpg';
	const base = path.basename(original, ext);
	const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${sanitizeFilename(base)}${ext}`;
	const destPath = path.join(uploadsDir, unique);
	await fs.promises.copyFile(file.filepath, destPath);
	const relative = `/schoolImages/${unique}`;
	return { relative, absolute: destPath };
} 