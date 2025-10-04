import { mkdir, writeFile, readFile, unlink, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface StorageOptions {
	baseDir?: string;
}

interface FileMetadata {
	name: string;
	size: number;
	mimeType: string;
	uploadedAt: Date;
}

class FileStorageService {
	private baseDir: string;

	constructor(options: StorageOptions = {}) {
		this.baseDir = options.baseDir || './uploads';
	}

	async ensureDir(path: string): Promise<void> {
		if (!existsSync(path)) {
			await mkdir(path, { recursive: true });
		}
	}

	async upload(file: File, path?: string): Promise<FileMetadata> {
		const uploadPath = path || '';
		const fullDir = join(this.baseDir, uploadPath);
		await this.ensureDir(fullDir);

		const fileName = `${Date.now()}-${file.name}`;
		const filePath = join(fullDir, fileName);

		const buffer = Buffer.from(await file.arrayBuffer());
		await writeFile(filePath, buffer);

		return {
			name: fileName,
			size: file.size,
			mimeType: file.type,
			uploadedAt: new Date()
		};
	}

	async uploadBuffer(
		buffer: Buffer,
		fileName: string,
		mimeType: string,
		path?: string
	): Promise<FileMetadata> {
		const uploadPath = path || '';
		const fullDir = join(this.baseDir, uploadPath);
		await this.ensureDir(fullDir);

		const fullFileName = `${Date.now()}-${fileName}`;
		const filePath = join(fullDir, fullFileName);

		await writeFile(filePath, buffer);

		return {
			name: fullFileName,
			size: buffer.length,
			mimeType,
			uploadedAt: new Date()
		};
	}

	async download(fileName: string, path?: string): Promise<Buffer> {
		const uploadPath = path || '';
		const filePath = join(this.baseDir, uploadPath, fileName);
		return await readFile(filePath);
	}

	async delete(fileName: string, path?: string): Promise<void> {
		const uploadPath = path || '';
		const filePath = join(this.baseDir, uploadPath, fileName);
		await unlink(filePath);
	}

	async list(path?: string): Promise<string[]> {
		const uploadPath = path || '';
		const fullDir = join(this.baseDir, uploadPath);
		await this.ensureDir(fullDir);
		return await readdir(fullDir);
	}

	async getMetadata(fileName: string, path?: string): Promise<FileMetadata | null> {
		try {
			const uploadPath = path || '';
			const filePath = join(this.baseDir, uploadPath, fileName);
			const stats = await stat(filePath);

			return {
				name: fileName,
				size: stats.size,
				mimeType: 'application/octet-stream',
				uploadedAt: stats.mtime
			};
		} catch {
			return null;
		}
	}
}

export const storage = new FileStorageService({ baseDir: './uploads' });

export function createTestStorage(): FileStorageService {
	return new FileStorageService({ baseDir: './test-uploads' });
}
