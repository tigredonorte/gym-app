
import * as fs from 'fs';
import * as crypto from 'crypto';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export async function getConfigHash<T>(config: T): Promise<string> {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(config));
  return hash.digest('hex');
}

export async function getCachedHash(cacheFilePath: string): Promise<string | null> {
  try {
    return await readFile(cacheFilePath, 'utf8');
  } catch {
    return null;
  }
}

export async function setCachedHash(cacheFilePath: string, hash: string): Promise<void> {
  await writeFile(cacheFilePath, hash, 'utf8');
}
