export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatDateTimeIndo(dateTimeStr: string): string {
  if (!dateTimeStr) return '-';
  try {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return dateTimeStr;
  }
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'approved':
      return {
        label: 'Approved / Sah',
        bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        dot: 'bg-emerald-500'
      };
    case 'waiting_verification':
      return {
        label: 'Menunggu Verifikasi',
        bg: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        dot: 'bg-amber-500'
      };
    case 'pending_payment':
      return {
        label: 'Belum Bayar',
        bg: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
        dot: 'bg-slate-400'
      };
    case 'rejected':
      return {
        label: 'Ditolak',
        bg: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
        dot: 'bg-rose-500'
      };
    case 'published':
      return {
        label: 'Published',
        bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        dot: 'bg-emerald-500'
      };
    case 'draft':
      return {
        label: 'Draft',
        bg: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
        dot: 'bg-slate-400'
      };
    case 'closed':
      return {
        label: 'Pendaftaran Ditutup',
        bg: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
        dot: 'bg-rose-500'
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400'
      };
  }
}
