import Dexie, { Table } from 'dexie';

export interface OfflineCustomer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  invoices:[];
  syncStatus: 'synced' | 'pending_add' | 'pending_edit' | 'pending_delete';
  originalId?: number; // لحفظ المعرف الحقيقي من السيرفر
}

export class MyDatabase extends Dexie {
  customers!: Table<OfflineCustomer>;

  constructor() {
    super('CRM_Offline_DB');
    this.version(1).stores({
      customers: '++id, email, syncStatus, originalId'
    });
  }
}

export const db = new MyDatabase();