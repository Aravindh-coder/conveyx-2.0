import fs from 'fs';
import path from 'path';
import { db } from '../models/db.js';
import { CompanyInfo, ConveyorSystem } from '../../../shared/types.js';

const STORAGE_FILE = path.resolve(process.cwd(), 'conveyx_registrations.json');

/**
 * Hydrate site registration & company state on server startup
 */
export function initDatabase(): void {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (data.company) {
        db.company = data.company;
      }
      if (data.conveyor) {
        db.conveyor = data.conveyor;
      }
      if (data.incidents && Array.isArray(data.incidents)) {
        db.incidents = data.incidents;
      }
      if (data.sosMessages && Array.isArray(data.sosMessages)) {
        db.sosMessages = data.sosMessages;
      }
      console.log('[Database] Hydrated site registration & company state from persistent storage.');
    } else {
      console.log('[Database] Initialized default database state.');
    }
  } catch (err) {
    console.error('[Database] Failed to hydrate state:', err);
  }
}

/**
 * Persist site registration data to storage
 */
export function saveRegistrationData(company: CompanyInfo, conveyor: ConveyorSystem): void {
  try {
    db.company = company;
    db.conveyor = conveyor;

    const payload = {
      company: db.company,
      conveyor: db.conveyor,
      incidents: db.incidents,
      sosMessages: db.sosMessages,
      savedAt: new Date().toISOString()
    };

    fs.writeFileSync(STORAGE_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    console.log('[Database] Successfully saved site registration data.');
  } catch (err) {
    console.error('[Database] Failed to persist registration:', err);
  }
}
