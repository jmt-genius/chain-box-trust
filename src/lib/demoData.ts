export interface BatchEvent {
  id: string;
  actor: string;
  role: string;
  timestamp: string;
  note: string;
  image?: string;
  hash: string;
  ledgerRef: string;
}

export interface Batch {
  id: string;
  productName: string;
  sku?: string;
  origin: string;
  createdAt: string;
  baselineImage: string;
  events: BatchEvent[];
}

// Generate fake SHA256-like hash
export const generateHash = (input: string): string => {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
};

// Generate fake ledger reference
export const generateLedgerRef = (): string => {
  const chars = '0123456789ABCDEF';
  let ref = '0x';
  for (let i = 0; i < 40; i++) {
    ref += chars[Math.floor(Math.random() * 16)];
  }
  return ref;
};

export const DEMO_BATCHES: Batch[] = [
  {
    id: 'CHT-001-ABC',
    productName: 'VitaTabs 10mg',
    sku: 'VT-10MG-001',
    origin: 'VitaLabs Pvt Ltd',
    createdAt: '2025-10-01T09:30:00Z',
    baselineImage: '/demo/vitatabs.jpg',
    events: [
      {
        id: 'evt-1',
        actor: 'FastLogistics',
        role: '3PL',
        timestamp: '2025-10-02T11:15:00Z',
        note: 'Arrived at WH. No damage',
        image: '/demo/wh1.jpg',
        hash: 'a7f5c8d9e2b1f4a6c3d8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
        ledgerRef: '0x7A9F2E1B4C8D5A3E6F9B2C1D4E7A3B5C8D1E4F7A2B'
      },
      {
        id: 'evt-2',
        actor: 'SuperMart',
        role: 'Retailer',
        timestamp: '2025-10-05T09:12:00Z',
        note: 'Received - packaging intact',
        image: '/demo/retail1.jpg',
        hash: 'b3e9f2a1c4d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
        ledgerRef: '0x2F5B8E1C4A7D3E6F9B2C5D8E1A4B7C0D3E6F9A2B'
      }
    ]
  },
  {
    id: 'CHT-002-XYZ',
    productName: 'ColdVax',
    sku: 'CV-001',
    origin: 'MediCore Labs',
    createdAt: '2025-09-28T07:20:00Z',
    baselineImage: '/demo/coldvax.jpg',
    events: [
      {
        id: 'evt-3',
        actor: 'ChillTransport',
        role: '3PL',
        timestamp: '2025-09-29T14:30:00Z',
        note: 'Minor dent on corner',
        image: '/demo/coldvax-transit.jpg',
        hash: 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d',
        ledgerRef: '0x4D7A2E5B8C1F3A6E9B2D5C8E1A4F7B0C3D6E9F2A'
      }
    ]
  },
  {
    id: 'CHT-DEMO',
    productName: 'Generic Demo Product',
    sku: 'DEMO-001',
    origin: 'Demo Manufacturing Co.',
    createdAt: '2025-10-05T10:00:00Z',
    baselineImage: '/demo/generic.jpg',
    events: [
      {
        id: 'evt-4',
        actor: 'WarehouseA',
        role: 'Warehouse',
        timestamp: '2025-10-06T08:30:00Z',
        note: 'Initial warehouse scan',
        image: '/demo/warehouse.jpg',
        hash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
        ledgerRef: '0x9E2B5C8F1A4D7E0B3C6F9A2D5E8B1C4F7A0D3E6F'
      },
      {
        id: 'evt-5',
        actor: 'RetailChain',
        role: 'Retailer',
        timestamp: '2025-10-08T16:45:00Z',
        note: 'Received at retail location',
        image: '/demo/retail.jpg',
        hash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
        ledgerRef: '0x3C6F9A2E5B8D1F4A7C0E3B6D9F2A5C8E1B4D7F0A'
      }
    ]
  }
];

// LocalStorage management
const STORAGE_KEY = 'boxity-batches';

export const loadBatches = (): Batch[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [...DEMO_BATCHES];
    }
  }
  return [...DEMO_BATCHES];
};

export const saveBatches = (batches: Batch[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
};

export const resetDemoData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
