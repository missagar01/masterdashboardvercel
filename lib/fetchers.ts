import type { IndentSheet, MasterSheet, ReceivedSheet, Sheet } from '@/types';
import type { InventorySheet, PoMasterSheet, UserPermissions, Vendor } from '@/types/sheets';
import { API_URL } from '../api';

export async function fetchSheet(
  sheetName: Sheet
): Promise<
  MasterSheet | IndentSheet[] | ReceivedSheet[] | UserPermissions[] | PoMasterSheet[] | InventorySheet[]
> {
  const response = await fetch(`/api/sheets?sheetName=${encodeURIComponent(sheetName)}`);

  if (!response.ok) throw new Error('Failed to fetch data');
  const raw = await response.json();
  if (!raw.success) throw new Error('Something went wrong when parsing data');

  if (sheetName === 'MASTER') {
    const data = raw.options;

    // @ts-expect-error Assuming data is structured correctly
    const length = Math.max(...Object.values(data).map((arr) => arr.length));

    const vendors: Vendor[] = [];
    const groupHeads: Record<string, Set<string>> = {};
    const departments = new Set<string>();
    const paymentTerms = new Set<string>();
    const defaultTerms = new Set<string>();

    for (let i = 0; i < length; i++) {
      const vendorName = data.vendorName?.[i];
      const gstin = data.vendorGstin?.[i];
      const address = data.vendorAddress?.[i];
      const email = data.vendorEmail?.[i];
      if (vendorName && gstin && address) {
        vendors.push({ vendorName, gstin, address, email });
      }

      if (data.department?.[i]) departments.add(data.department[i]);
      if (data.paymentTerm?.[i]) paymentTerms.add(data.paymentTerm[i]);
      if (data.defaultTerms?.[i]) defaultTerms.add(data.defaultTerms[i]);

      const group = data.groupHead?.[i];
      const item = data.itemName?.[i];
      if (group && item) {
        if (!groupHeads[group]) groupHeads[group] = new Set();
        groupHeads[group].add(item);
      }
    }

    return {
      vendors,
      departments: [...departments],
      paymentTerms: [...paymentTerms],
      groupHeads: Object.fromEntries(Object.entries(groupHeads).map(([k, v]) => [k, [...v]])),
      companyPan: data.companyPan,
      companyName: data.companyName,
      companyAddress: data.companyAddress,
      companyPhone: data.companyPhone,
      companyGstin: data.companyGstin,
      billingAddress: data.billingAddress,
      destinationAddress: data.destinationAddress,
      defaultTerms: [...defaultTerms],
    };
  }
  return raw.rows.filter((r: IndentSheet) => r.timestamp !== '');
}

// Vendor Rate Update APIs
const API_BASE = `${API_URL}`;

export async function fetchVendorRateUpdatePending() {
  const res = await fetch(`${API_BASE}/pending`);
  if (!res.ok) throw new Error('Failed to fetch pending vendor rates');
  return res.json();
}

export async function fetchVendorRateUpdateHistory() {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to fetch vendor rate history');
  return res.json();
}

export async function submitVendorRateUpdate(indentNumber: string, vendors: any) {
  const res = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ indentNumber, vendors }),
  });
  if (!res.ok) throw new Error('Failed to update vendor rate');
  return res.json();
}
