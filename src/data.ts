export type CallStatus = 'open' | 'closed'
export type InvoiceStatus = 'open' | 'unpaid' | 'paid'
export type CallDirection = 'incoming' | 'outgoing' | 'missed'

export interface ServiceCall {
  id: string
  customer: string
  phone: string
  address: string
  issue: string
  status: CallStatus
  scheduled: string
  urgency: 'high' | 'medium' | 'low'
}

export interface Invoice {
  id: string
  number: string
  customer: string
  amount: number
  status: InvoiceStatus
  dueDate: string
  description: string
}

export interface FollowUp {
  id: string
  customer: string
  phone: string
  reason: string
  lastContact: string
  priority: 'high' | 'medium' | 'low'
}

export interface EquipmentItem {
  id: string
  name: string
  qty: number
  location: string
  status: 'in_stock' | 'low' | 'missing'
}

export interface PhoneLogEntry {
  id: string
  phone: string
  customerName: string | null
  direction: CallDirection
  duration: string
  time: string
  note?: string
}

export const serviceCalls: ServiceCall[] = [
  {
    id: 'c1',
    customer: 'משפחת כהן',
    phone: '052-448-1190',
    address: 'הרצל 12, רמת גן',
    issue: 'סתימה במטבח — מים חוזרים',
    status: 'open',
    scheduled: 'היום · 10:30',
    urgency: 'high',
  },
  {
    id: 'c2',
    customer: 'אורי לוי',
    phone: '054-771-2033',
    address: 'ביאליק 8, תל אביב',
    issue: 'ברז מקלחת נוזל',
    status: 'open',
    scheduled: 'היום · 14:00',
    urgency: 'medium',
  },
  {
    id: 'c3',
    customer: 'דירה 4 · בניין דפנה',
    phone: '03-641-8821',
    address: 'דפנה 3, גבעתיים',
    issue: 'החלפת אסלה — דירה חדשה',
    status: 'open',
    scheduled: 'מחר · 09:00',
    urgency: 'low',
  },
  {
    id: 'c4',
    customer: 'נועה אברהם',
    phone: '050-998-4412',
    address: 'ויצמן 45, חולון',
    issue: 'דוד שמש — אין מים חמים',
    status: 'open',
    scheduled: 'מחר · 11:30',
    urgency: 'high',
  },
  {
    id: 'c5',
    customer: 'יוסי מזרחי',
    phone: '052-110-7744',
    address: 'אלנבי 90, תל אביב',
    issue: 'תיקון צינור מתחת לכיור',
    status: 'closed',
    scheduled: 'אתמול · 16:00',
    urgency: 'medium',
  },
  {
    id: 'c6',
    customer: 'רשת סופר פארם',
    phone: '03-555-0199',
    address: 'קניון עזריאלי',
    issue: 'תחזוקה שוטפת — שירותים',
    status: 'closed',
    scheduled: 'אתמול · 08:00',
    urgency: 'low',
  },
  {
    id: 'c7',
    customer: 'דניאל שפירא',
    phone: '058-220-6611',
    address: 'סוקולוב 17, הרצליה',
    issue: 'התקנת ברז מטבח חדש',
    status: 'closed',
    scheduled: 'יום ב׳ · 13:00',
    urgency: 'low',
  },
]

export const invoices: Invoice[] = [
  {
    id: 'i1',
    number: 'INV-2041',
    customer: 'משפחת כהן',
    amount: 480,
    status: 'open',
    dueDate: 'טרם נשלחה',
    description: 'פתיחת סתימה + החלפת סיפון',
  },
  {
    id: 'i2',
    number: 'INV-2038',
    customer: 'אורי לוי',
    amount: 320,
    status: 'open',
    dueDate: 'טיוטה',
    description: 'החלפת אטם ברז מקלחת',
  },
  {
    id: 'i3',
    number: 'INV-2029',
    customer: 'יוסי מזרחי',
    amount: 650,
    status: 'unpaid',
    dueDate: 'עבר מועד · לפני 4 ימים',
    description: 'תיקון צינור + חומרים',
  },
  {
    id: 'i4',
    number: 'INV-2025',
    customer: 'רשת סופר פארם',
    amount: 1800,
    status: 'unpaid',
    dueDate: 'לתשלום עד יום ה׳',
    description: 'חוזה חודשי — מרץ',
  },
  {
    id: 'i5',
    number: 'INV-2019',
    customer: 'דניאל שפירא',
    amount: 890,
    status: 'paid',
    dueDate: 'שולם 07/03',
    description: 'התקנת ברז + חיבורים',
  },
  {
    id: 'i6',
    number: 'INV-2014',
    customer: 'מיכל רוזן',
    amount: 420,
    status: 'paid',
    dueDate: 'שולם 05/03',
    description: 'פתיחת סתימה באמבטיה',
  },
]

export const followUps: FollowUp[] = [
  {
    id: 'f1',
    customer: 'יוסי מזרחי',
    phone: '052-110-7744',
    reason: 'חשבונית לא שולמה — לשלוח תזכורת',
    lastContact: 'לפני 4 ימים',
    priority: 'high',
  },
  {
    id: 'f2',
    customer: 'נועה אברהם',
    phone: '050-998-4412',
    reason: 'לחזור עם הצעת מחיר לדוד שמש',
    lastContact: 'הבוקר',
    priority: 'high',
  },
  {
    id: 'f3',
    customer: 'בניין דפנה · ועד בית',
    phone: '03-641-8821',
    reason: 'לאשר מועד התקנה לדירה 4',
    lastContact: 'אתמול',
    priority: 'medium',
  },
  {
    id: 'f4',
    customer: 'מיכל רוזן',
    phone: '054-332-1188',
    reason: 'בדיקת מעקב אחרי תיקון — שביעות רצון',
    lastContact: 'לפני שבוע',
    priority: 'low',
  },
]

export const equipment: EquipmentItem[] = [
  {
    id: 'e1',
    name: 'ברז מטבח נירוסטה',
    qty: 3,
    location: 'רכב · תא אחורי',
    status: 'in_stock',
  },
  {
    id: 'e2',
    name: 'סיפון כיור אוניברסלי',
    qty: 8,
    location: 'מחסן',
    status: 'in_stock',
  },
  {
    id: 'e3',
    name: 'אטמי ברז (סט)',
    qty: 2,
    location: 'תיק כלים',
    status: 'low',
  },
  {
    id: 'e4',
    name: 'צינור גמיש ½״',
    qty: 5,
    location: 'רכב',
    status: 'in_stock',
  },
  {
    id: 'e5',
    name: 'אסלת מונובלוק',
    qty: 0,
    location: '—',
    status: 'missing',
  },
  {
    id: 'e6',
    name: 'תרמוסטט לדוד שמש',
    qty: 0,
    location: 'הזמנה ממתינה',
    status: 'missing',
  },
  {
    id: 'e7',
    name: 'דבק PVC',
    qty: 1,
    location: 'תיק כלים',
    status: 'low',
  },
  {
    id: 'e8',
    name: 'מפתח צינורות 14״',
    qty: 1,
    location: 'רכב',
    status: 'in_stock',
  },
]

export const phoneLog: PhoneLogEntry[] = [
  {
    id: 'p1',
    phone: '052-448-1190',
    customerName: 'משפחת כהן',
    direction: 'incoming',
    duration: '3:42',
    time: 'היום · 08:14',
    note: 'סתימה דחופה — נקבעה ל־10:30',
  },
  {
    id: 'p2',
    phone: '050-771-0044',
    customerName: null,
    direction: 'missed',
    duration: '—',
    time: 'היום · 07:51',
    note: 'לא מזוהה · לא חזרת עדיין',
  },
  {
    id: 'p3',
    phone: '054-771-2033',
    customerName: 'אורי לוי',
    direction: 'outgoing',
    duration: '1:18',
    time: 'היום · 07:40',
    note: 'אישור הגעה ל־14:00',
  },
  {
    id: 'p4',
    phone: '03-555-8820',
    customerName: null,
    direction: 'incoming',
    duration: '0:48',
    time: 'אתמול · 19:22',
    note: 'לא מזוהה · ביקש הצעת מחיר לפתיחת סתימה',
  },
  {
    id: 'p5',
    phone: '052-110-7744',
    customerName: 'יוסי מזרחי',
    direction: 'outgoing',
    duration: '2:05',
    time: 'אתמול · 17:10',
    note: 'תזכורת תשלום — אמר שישלם מחר',
  },
  {
    id: 'p6',
    phone: '058-903-1177',
    customerName: null,
    direction: 'missed',
    duration: '—',
    time: 'אתמול · 12:03',
    note: 'לא מזוהה · שיחה שלא נענתה',
  },
  {
    id: 'p7',
    phone: '050-998-4412',
    customerName: 'נועה אברהם',
    direction: 'incoming',
    duration: '4:11',
    time: 'אתמול · 10:45',
    note: 'בעיה בדוד — צריך הצעת מחיר',
  },
  {
    id: 'p8',
    phone: '052-660-4419',
    customerName: null,
    direction: 'incoming',
    duration: '1:02',
    time: 'יום ב׳ · 16:30',
    note: 'לא מזוהה · דיבר על נזילה במרתף',
  },
]

export function formatMoney(n: number) {
  return `₪${n.toLocaleString('he-IL')}`
}
