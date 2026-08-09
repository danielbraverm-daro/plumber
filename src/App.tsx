import { useEffect, useMemo, useState } from 'react'
import {
  equipment,
  followUps,
  formatMoney,
  invoices,
  phoneLog,
  serviceCalls,
  type CallDirection,
  type EquipmentItem,
  type InvoiceStatus,
  type ServiceCall,
} from './data'

type View = 'dashboard' | 'calls' | 'invoices' | 'followups' | 'equipment' | 'phonelog'
type Theme = 'clean' | 'vivid'

const THEME_KEY = 'tzinor-theme'

const navItems: { id: View; label: string; count?: number }[] = [
  { id: 'dashboard', label: 'לוח בקרה' },
  { id: 'calls', label: 'קריאות שירות', count: serviceCalls.filter((c) => c.status === 'open').length },
  { id: 'invoices', label: 'חשבוניות', count: invoices.filter((i) => i.status === 'unpaid').length },
  { id: 'followups', label: 'לחזור אליהם', count: followUps.length },
  { id: 'equipment', label: 'ציוד ומלאי' },
  { id: 'phonelog', label: 'יומן שיחות', count: phoneLog.filter((p) => !p.customerName).length },
]

function urgencyLabel(u: ServiceCall['urgency']) {
  return u === 'high' ? 'דחוף' : u === 'medium' ? 'בינוני' : 'רגיל'
}

function invoiceLabel(s: InvoiceStatus) {
  return s === 'open' ? 'פתוחה' : s === 'unpaid' ? 'לא שולמה' : 'שולמה'
}

function directionMeta(d: CallDirection) {
  if (d === 'incoming') return { label: 'נכנסת', cls: '', icon: '↙' }
  if (d === 'outgoing') return { label: 'יוצאת', cls: 'outgoing', icon: '↗' }
  return { label: 'לא נענתה', cls: 'missed', icon: '✕' }
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden>
      <svg viewBox="0 0 28 28" fill="none">
        <path
          d="M5 15c0-4.4 3.6-8 8-8h2v3h-2a5 5 0 100 10h5a5 5 0 004.2-7.7l2.2-2.1A8 8 0 0120 23h-5c-5.5 0-10-4.5-10-8z"
          fill="var(--brand-icon)"
        />
        <circle cx="20" cy="7" r="3" fill="var(--brand-dot)" />
      </svg>
    </div>
  )
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string | number
  hint: string
  tone?: 'warn' | 'danger' | 'ok'
}) {
  return (
    <div className={`stat ${tone ?? ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-hint">{hint}</div>
    </div>
  )
}

function CallRows({ items }: { items: ServiceCall[] }) {
  if (!items.length) return <div className="empty">אין קריאות להצגה</div>
  return (
    <ul className="list">
      {items.map((c) => (
        <li key={c.id} className="row">
          <div>
            <div className="row-title">{c.customer}</div>
            <div className="row-meta">
              {c.issue}
              <br />
              {c.address} · {c.phone}
            </div>
          </div>
          <div className="row-side">
            <span className={`badge ${c.urgency}`}>{urgencyLabel(c.urgency)}</span>
            <span className="row-meta">{c.scheduled}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

function Dashboard() {
  const [callTab, setCallTab] = useState<'open' | 'closed'>('open')
  const [invTab, setInvTab] = useState<InvoiceStatus>('unpaid')

  const openCalls = serviceCalls.filter((c) => c.status === 'open')
  const closedCalls = serviceCalls.filter((c) => c.status === 'closed')
  const filteredInvoices = invoices.filter((i) => i.status === invTab)
  const missing = equipment.filter((e) => e.status === 'missing')
  const unknownCalls = phoneLog.filter((p) => !p.customerName)

  const unpaidSum = invoices
    .filter((i) => i.status === 'unpaid')
    .reduce((s, i) => s + i.amount, 0)

  return (
    <>
      <header className="topbar">
        <div>
          <h1>בוקר טוב, דני</h1>
          <p>היום יש לך 4 קריאות פתוחות, 2 חשבוניות שלא שולמו, ומספר שלא מזוהה שמחכה לחזרה.</p>
        </div>
        <div className="top-actions">
          <button className="btn btn-ghost" type="button">
            + לקוח חדש
          </button>
          <button className="btn btn-primary" type="button">
            + קריאת שירות
          </button>
        </div>
      </header>

      <section className="stats" aria-label="סיכום יומי">
        <Stat label="קריאות פתוחות" value={openCalls.length} hint="2 דחופות להיום" tone="warn" />
        <Stat label="לא שולם" value={formatMoney(unpaidSum)} hint="2 חשבוניות ממתינות" tone="danger" />
        <Stat label="לחזור אליהם" value={followUps.length} hint="תזכורות ומעקב" />
        <Stat label="מספרים לא מזוהים" value={unknownCalls.length} hint="מהיומן · לחץ לשמירה" tone="ok" />
      </section>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>קריאות שירות</h2>
              <div className="sub">מהשטח · לפי סטטוס</div>
            </div>
            <div className="tabs">
              <button
                type="button"
                className={`tab ${callTab === 'open' ? 'active' : ''}`}
                onClick={() => setCallTab('open')}
              >
                פתוחות ({openCalls.length})
              </button>
              <button
                type="button"
                className={`tab ${callTab === 'closed' ? 'active' : ''}`}
                onClick={() => setCallTab('closed')}
              >
                סגורות ({closedCalls.length})
              </button>
            </div>
          </div>
          <CallRows items={callTab === 'open' ? openCalls : closedCalls} />
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>יומן שיחות</h2>
              <div className="sub">מחובר לקו הטלפון שלך</div>
            </div>
          </div>
          <ul className="list">
            {phoneLog.slice(0, 5).map((p) => {
              const dir = directionMeta(p.direction)
              return (
                <li key={p.id} className="row phone-row">
                  <div className={`dir-icon ${dir.cls}`} title={dir.label}>
                    {dir.icon}
                  </div>
                  <div>
                    <div className="row-title">
                      {p.customerName ?? (
                        <span className="unknown-phone">{p.phone}</span>
                      )}
                      {!p.customerName && (
                        <span className="badge unknown" style={{ marginInlineStart: 8 }}>
                          לא מזוהה
                        </span>
                      )}
                    </div>
                    <div className="row-meta">
                      {p.customerName ? p.phone + ' · ' : ''}
                      {p.note}
                    </div>
                  </div>
                  <div className="row-side">
                    <span className="row-meta">{p.time}</span>
                    <span className="row-meta">{p.duration}</span>
                    {!p.customerName && (
                      <button type="button" className="save-link">
                        שמור כלקוח
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>חשבוניות</h2>
              <div className="sub">פתוחות · לא שולמו · שולמו</div>
            </div>
            <div className="tabs">
              {(['open', 'unpaid', 'paid'] as InvoiceStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`tab ${invTab === s ? 'active' : ''}`}
                  onClick={() => setInvTab(s)}
                >
                  {invoiceLabel(s)} ({invoices.filter((i) => i.status === s).length})
                </button>
              ))}
            </div>
          </div>
          <ul className="list">
            {filteredInvoices.map((inv) => (
              <li key={inv.id} className="row">
                <div>
                  <div className="row-title">
                    {inv.number} · {inv.customer}
                  </div>
                  <div className="row-meta">
                    {inv.description}
                    <br />
                    {inv.dueDate}
                  </div>
                </div>
                <div className="row-side">
                  <span className="money">{formatMoney(inv.amount)}</span>
                  <span className={`badge ${inv.status}`}>{invoiceLabel(inv.status)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="split-2" style={{ display: 'grid', gap: 16 }}>
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>לקוחות לחזרה</h2>
                <div className="sub">אל תפספס שיחה</div>
              </div>
            </div>
            <ul className="list">
              {followUps.slice(0, 3).map((f) => (
                <li key={f.id} className="row">
                  <div>
                    <div className="row-title">{f.customer}</div>
                    <div className="row-meta">{f.reason}</div>
                  </div>
                  <div className="row-side">
                    <span className={`badge ${f.priority}`}>
                      {f.priority === 'high' ? 'דחוף' : f.priority === 'medium' ? 'בינוני' : 'רגיל'}
                    </span>
                    <span className="row-meta">{f.lastContact}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>ציוד חסר</h2>
                <div className="sub">{missing.length} פריטים להזמנה</div>
              </div>
            </div>
            <ul className="list">
              {missing.map((e) => (
                <li key={e.id} className="row">
                  <div>
                    <div className="row-title">{e.name}</div>
                    <div className="row-meta">{e.location}</div>
                  </div>
                  <span className="badge missing">חסר</span>
                </li>
              ))}
              {equipment
                .filter((e) => e.status === 'low')
                .slice(0, 2)
                .map((e) => (
                  <li key={e.id} className="row">
                    <div>
                      <div className="row-title">{e.name}</div>
                      <div className="row-meta">
                        נשארו {e.qty} · {e.location}
                      </div>
                    </div>
                    <span className="badge medium">אוזל</span>
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}

function CallsView() {
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('open')
  const items = useMemo(() => {
    if (filter === 'all') return serviceCalls
    return serviceCalls.filter((c) => c.status === filter)
  }, [filter])

  return (
    <div className="view-full">
      <div className="section-intro">
        <h1>קריאות שירות</h1>
        <p>כל העבודות בשטח — פתוחות וסגורות, עם כתובת, דחיפות ומועד.</p>
      </div>
      <div className="filters">
        {(
          [
            ['open', 'פתוחות'],
            ['closed', 'סגורות'],
            ['all', 'הכל'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`filter-chip ${filter === id ? 'active' : ''}`}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <section className="panel table-panel">
        <CallRows items={items} />
      </section>
    </div>
  )
}

function InvoicesView() {
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('unpaid')
  const items = useMemo(() => {
    if (filter === 'all') return invoices
    return invoices.filter((i) => i.status === filter)
  }, [filter])

  return (
    <div className="view-full">
      <div className="section-intro">
        <h1>חשבוניות</h1>
        <p>פתוחות לטיוטה, ממתינות לתשלום, ושולמו — הכל במקום אחד.</p>
      </div>
      <div className="filters">
        {(
          [
            ['open', 'פתוחות'],
            ['unpaid', 'לא שולמו'],
            ['paid', 'שולמו'],
            ['all', 'הכל'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`filter-chip ${filter === id ? 'active' : ''}`}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <section className="panel table-panel">
        <ul className="list">
          {items.map((inv) => (
            <li key={inv.id} className="row">
              <div>
                <div className="row-title">
                  {inv.number} · {inv.customer}
                </div>
                <div className="row-meta">
                  {inv.description}
                  <br />
                  {inv.dueDate}
                </div>
              </div>
              <div className="row-side">
                <span className="money">{formatMoney(inv.amount)}</span>
                <span className={`badge ${inv.status}`}>{invoiceLabel(inv.status)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function FollowUpsView() {
  return (
    <div className="view-full">
      <div className="section-intro">
        <h1>לקוחות שצריך לחזור אליהם</h1>
        <p>תזכורות חכמות אחרי שיחה, הצעת מחיר, או חשבונית שלא שולמה.</p>
      </div>
      <section className="panel table-panel">
        <ul className="list">
          {followUps.map((f) => (
            <li key={f.id} className="row">
              <div>
                <div className="row-title">{f.customer}</div>
                <div className="row-meta">
                  {f.reason}
                  <br />
                  {f.phone}
                </div>
              </div>
              <div className="row-side">
                <span className={`badge ${f.priority}`}>
                  {f.priority === 'high' ? 'דחוף' : f.priority === 'medium' ? 'בינוני' : 'רגיל'}
                </span>
                <span className="row-meta">{f.lastContact}</span>
                <button type="button" className="save-link">
                  התקשר עכשיו
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function EquipmentView() {
  const have = equipment.filter((e) => e.status !== 'missing')
  const missing = equipment.filter((e) => e.status === 'missing')

  const renderItems = (items: EquipmentItem[]) =>
    items.map((e) => (
      <article key={e.id} className={`equip-item ${e.status === 'missing' ? 'missing' : ''}`}>
        <h3>{e.name}</h3>
        <p>{e.location}</p>
        <div className="equip-foot">
          <span className="row-meta">כמות: {e.qty}</span>
          <span
            className={`badge ${
              e.status === 'missing' ? 'missing' : e.status === 'low' ? 'medium' : 'stock'
            }`}
          >
            {e.status === 'missing' ? 'חסר' : e.status === 'low' ? 'אוזל' : 'במלאי'}
          </span>
        </div>
      </article>
    ))

  return (
    <div className="view-full">
      <div className="section-intro">
        <h1>ציוד ומלאי</h1>
        <p>מה שיש ברכב ובמחסן — ומה שחסר לפני שיוצאים לקריאה.</p>
      </div>
      <div className="split-2">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>ציוד שיש לי</h2>
              <div className="sub">{have.length} פריטים</div>
            </div>
          </div>
          <div className="equip-grid">{renderItems(have)}</div>
        </section>
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>ציוד שחסר לי</h2>
              <div className="sub">{missing.length} להזמנה</div>
            </div>
          </div>
          <div className="equip-grid">{renderItems(missing)}</div>
        </section>
      </div>
    </div>
  )
}

function PhoneLogView() {
  const [onlyUnknown, setOnlyUnknown] = useState(false)
  const items = onlyUnknown ? phoneLog.filter((p) => !p.customerName) : phoneLog

  return (
    <div className="view-full">
      <div className="section-intro">
        <h1>יומן שיחות</h1>
        <p>
          כל שיחה שנכנסת או יוצאת מהקו שלך נרשמת אוטומטית — גם מספרים שעוד לא שמרת כלקוחות.
        </p>
      </div>
      <div className="filters">
        <button
          type="button"
          className={`filter-chip ${!onlyUnknown ? 'active' : ''}`}
          onClick={() => setOnlyUnknown(false)}
        >
          כל השיחות
        </button>
        <button
          type="button"
          className={`filter-chip ${onlyUnknown ? 'active' : ''}`}
          onClick={() => setOnlyUnknown(true)}
        >
          לא מזוהים בלבד
        </button>
      </div>
      <section className="panel table-panel">
        <ul className="list">
          {items.map((p) => {
            const dir = directionMeta(p.direction)
            return (
              <li key={p.id} className="row phone-row">
                <div className={`dir-icon ${dir.cls}`}>{dir.icon}</div>
                <div>
                  <div className="row-title">
                    {p.customerName ?? <span className="unknown-phone">{p.phone}</span>}
                    {!p.customerName && (
                      <span className="badge unknown" style={{ marginInlineStart: 8 }}>
                        לא מזוהה
                      </span>
                    )}
                  </div>
                  <div className="row-meta">
                    {dir.label}
                    {p.customerName ? ` · ${p.phone}` : ''}
                    {p.note ? ` · ${p.note}` : ''}
                  </div>
                </div>
                <div className="row-side">
                  <span className="row-meta">{p.time}</span>
                  <span className="row-meta">{p.duration}</span>
                  {!p.customerName && (
                    <button type="button" className="save-link">
                      שמור כלקוח
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>('dashboard')
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY)
    return saved === 'vivid' || saved === 'clean' ? saved : 'clean'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <BrandMark />
          <div className="brand-text">
            <div className="brand-name">צינור</div>
            <div className="brand-tag">CRM לשרברבים</div>
          </div>
        </div>

        <div className="theme-switch" role="group" aria-label="בחירת עיצוב">
          <button
            type="button"
            className={`theme-btn ${theme === 'clean' ? 'active' : ''}`}
            onClick={() => setTheme('clean')}
          >
            נקי
          </button>
          <button
            type="button"
            className={`theme-btn ${theme === 'vivid' ? 'active' : ''}`}
            onClick={() => setTheme('vivid')}
          >
            צבעוני
          </button>
        </div>

        <nav className="nav" aria-label="תפריט ראשי">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-btn ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <span>{item.label}</span>
              {typeof item.count === 'number' && <span className="count">{item.count}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-foot">
          <strong>הטלפון מחובר</strong>
          <p>שיחות נכנסות ויוצאות נרשמות אוטומטית ליומן — כולל מספרים חדשים.</p>
          <div className="phone-sync">
            <span className="dot-live" />
            קו פעיל · 052-448-1000
          </div>
        </div>
      </aside>

      <main className="main">
        {view === 'dashboard' && <Dashboard />}
        {view === 'calls' && <CallsView />}
        {view === 'invoices' && <InvoicesView />}
        {view === 'followups' && <FollowUpsView />}
        {view === 'equipment' && <EquipmentView />}
        {view === 'phonelog' && <PhoneLogView />}
      </main>
    </div>
  )
}
