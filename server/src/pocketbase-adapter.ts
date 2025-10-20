import { DBAdapter, type Where, type DBTransactionAdapter, type DBAdapterFactoryConfig } from '@better-auth/core/db/adapter';
import PocketBase from 'pocketbase';

export interface PocketBaseConfig {
  url: string;
  adminEmail: string;
  adminPassword: string;
}

export interface PocketBaseRecord {
  id: string;
  [key: string]: any;
}

export class PocketBaseAdapter implements DBAdapter {
  private pb: PocketBase;
  private config: PocketBaseConfig;
  private isAuthenticated = false;

  constructor(config: PocketBaseConfig) {
    this.config = config;
    this.pb = new PocketBase(config.url);
    // Disable auto cancellation to avoid issues with async operations
    this.pb.autoCancellation(false);
    console.log('PocketBase adapter initialized with URL:', config.url);
  }

  private async authenticate() {
    if (this.isAuthenticated && this.pb.authStore.isValid) {
      return; // Already authenticated
    }

    try {
      console.log('Attempting PocketBase authentication with:', {
        url: this.config.url,
        email: this.config.adminEmail,
        passwordLength: this.config.adminPassword.length
      });

      // Try to authenticate with the admin API
      await this.pb.collection('_superusers').authWithPassword(
        this.config.adminEmail,
        this.config.adminPassword
      );
      this.isAuthenticated = true;
      console.log('PocketBase authentication successful');
    } catch (error: any) {
      console.error('PocketBase authentication failed:', {
        error: error.message,
        status: error.status,
        url: this.config.url,
        email: this.config.adminEmail
      });
      
      // Add detailed error information
      if (error.status === 400 && error.data?.password) {
        console.error('Password validation error:', error.data.password);
      }
      
      throw new Error(`PocketBase authentication failed: ${error.message}`);
    }
  }

async create<T extends Record<string, any>, R = T>({
  model,
  data,
  select,
  forceAllowId
}: {
  model: string;
  data: Omit<T, 'id'>;
  select?: string[];
  forceAllowId?: boolean;
}): Promise<R> {
  await this.authenticate();
  
  try {
    console.log(`Creating record in '${model}':`, data);
    
    // Don't send 'id' field unless forceAllowId is true
    const createData = { ...data };
    if (!forceAllowId && 'id' in createData) {
      delete (createData as any).id;
    }
    
    const record = await this.pb.collection(model).create(createData);
    console.log(`✓ Created record in '${model}':`, record.id);
    return this.transformRecord(record) as R;
  } catch (error: any) {
    console.error(`Error creating record in '${model}':`, {
      error: error.message,
      status: error.status,
      data: error.data,
    });
    throw error;
  }
}

  async findOne<T>({
    model,
    where,
    select
  }: {
    model: string;
    where: Where[];
    select?: string[];
  }): Promise<T | null> {
    await this.authenticate();
    try {
      // For simplicity, we'll use the first where condition
      const id = where[0]?.value as string;
      const record = await this.pb.collection(model).getOne(id);
      return this.transformRecord(record) as T;
    } catch (error) {
      return null;
    }
  }

async findMany<T>({
  model,
  where,
  limit,
  sortBy,
  offset
}: {
  model: string;
  where?: Where[];
  limit?: number;
  sortBy?: { field: string; direction: 'asc' | 'desc' };
  offset?: number;
}): Promise<T[]> {
  await this.authenticate();
  
  try {
    let options: any = {};
    if (limit) options.perPage = limit; // Use perPage instead of limit
    if (offset) options.page = Math.floor(offset / (limit || 1)) + 1;
    
    if (sortBy) {
      // Map common field names to PocketBase field names
      const fieldMapping: Record<string, string> = {
        'createdAt': 'created',
        'updatedAt': 'updated',
        'expiresAt': 'expiresAt', // Keep custom fields as-is
      };
      
      const field = fieldMapping[sortBy.field] || sortBy.field;
      // PocketBase uses - prefix for descending, no prefix for ascending
      options.sort = sortBy.direction === 'desc' ? `-${field}` : field;
    }
    
    console.log(`Fetching from collection '${model}' with options:`, options);
    
    const records = await this.pb.collection(model).getFullList(options);
    return records.map(record => this.transformRecord(record) as T);
  } catch (error: any) {
    console.error(`Error fetching from collection '${model}':`, {
      error: error.message,
      status: error.status,
      url: error.url,
    });
    
    // If collection doesn't exist, return empty array instead of throwing
    if (error.status === 400 || error.status === 404) {
      console.warn(`Collection '${model}' might not exist or has issues. Returning empty array.`);
      return [];
    }
    
    throw error;
  }
}

  async update<T>({
    model,
    where,
    update: updateData
  }: {
    model: string;
    where: Where[];
    update: Record<string, any>;
  }): Promise<T | null> {
    await this.authenticate();
    try {
      // For simplicity, we'll use the first where condition
      const id = where[0]?.value as string;
      const record = await this.pb.collection(model).update(id, updateData);
      return this.transformRecord(record) as T;
    } catch (error) {
      return null;
    }
  }

  async delete<T>({
    model,
    where
  }: {
    model: string;
    where: Where[];
  }): Promise<void> {
    await this.authenticate();
    try {
      // For simplicity, we'll use the first where condition
      const id = where[0]?.value as string;
      await this.pb.collection(model).delete(id);
    } catch (error) {
      // Silently handle delete errors
    }
  }

  async updateMany({
    model,
    where,
    update: updateData
  }: {
    model: string;
    where: Where[];
    update: Record<string, any>;
  }): Promise<number> {
    await this.authenticate();
    // This is a simplified implementation
    const records = await this.pb.collection(model).getFullList();
    let updatedCount = 0;
    
    for (const record of records) {
      // Check if record matches where conditions (simplified)
      if (this.matchesWhere(record, where)) {
        await this.pb.collection(model).update(record.id, updateData);
        updatedCount++;
      }
    }
    
    return updatedCount;
  }

  async deleteMany({
    model,
    where
  }: {
    model: string;
    where: Where[];
  }): Promise<number> {
    await this.authenticate();
    // This is a simplified implementation
    const records = await this.pb.collection(model).getFullList();
    let deletedCount = 0;
    
    for (const record of records) {
      // Check if record matches where conditions (simplified)
      if (this.matchesWhere(record, where)) {
        await this.pb.collection(model).delete(record.id);
        deletedCount++;
      }
    }
    
    return deletedCount;
  }

  async count({
    model,
    where
  }: {
    model: string;
    where?: Where[];
  }): Promise<number> {
    await this.authenticate();
    // Simplified implementation - get all records and count
    const records = await this.pb.collection(model).getFullList();
    
    if (!where || where.length === 0) {
      return records.length;
    }
    
    // Count records that match where conditions
    return records.filter(record => this.matchesWhere(record, where)).length;
  }

  async transaction<R>(callback: (trx: DBTransactionAdapter) => Promise<R>): Promise<R> {
    // PocketBase doesn't support transactions in the same way as SQL databases
    // We'll create a simple transaction adapter and pass it to the callback
    const trx: DBTransactionAdapter = {
      // For simplicity, we'll just use the same adapter methods
      create: this.create.bind(this),
      findOne: this.findOne.bind(this),
      findMany: this.findMany.bind(this),
      update: this.update.bind(this),
      delete: this.delete.bind(this),
      updateMany: this.updateMany.bind(this),
      deleteMany: this.deleteMany.bind(this),
      count: this.count.bind(this),
      id: this.id,
    };
    
    return await callback(trx);
  }

  get id(): string {
    return 'pocketbase-adapter';
  }

  private matchesWhere(record: any, where: Where[]): boolean {
    if (!where || where.length === 0) return true;
    
    // Simplified where clause matching
    for (const condition of where) {
      const { field, value, operator } = condition;
      // Handle createdAt field mapping
      const fieldName = field === 'createdAt' ? 'created_at' : field;
      const recordValue = record[fieldName];
      
      switch (operator) {
        case 'eq':
          if (recordValue !== value) return false;
          break;
        case 'ne':
          if (recordValue === value) return false;
          break;
        case 'in':
          if (Array.isArray(value) && (value as any[]).includes(recordValue)) return true;
          return false;
        default:
          // Default to equality for unknown operators
          if (recordValue !== value) return false;
      }
    }
    
    return true;
  }

  private transformRecord(record: any): PocketBaseRecord {
    return {
      id: record.id,
      ...record,
    };
  }
}

export interface PocketBaseAdapterConfig {
  url: string;
  adminEmail: string;
  adminPassword: string;
  debugLogs?: boolean;
}

export const pocketbaseAdapter = (config: PocketBaseAdapterConfig) => {
  return (options: any) => {
    const adapter = new PocketBaseAdapter({
      url: config.url,
      adminEmail: config.adminEmail,
      adminPassword: config.adminPassword,
    });

    return adapter;
  };
};