import { PROPERTY_STATUS_LABELS } from "@/types"

export function getPropertyStatusLabel(status: number): string | null {
  return PROPERTY_STATUS_LABELS[status] ?? null
}
