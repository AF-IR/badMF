/* سرفصل سکشن با نوار گرادیان + متن معرفی */
export function SectionTitle({ title, lead, children }) {
  return (
    <>
      <div className="h2-bar"><h2>{title}</h2></div>
      {lead && <p className="lead" style={{ marginBottom: 30 }}>{lead}</p>}
      {children}
    </>
  );
}

/* نوار CTA گرادیانی با لینک رزرو */
export function CtaBand({ title, text }) {
  return (
    <div className="cta-band">
      <h2>{title}</h2>
      <p>{text}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a className="btn btn-primary" style={{ background: '#06251d', color: '#fff' }} href="/booking">📅 رزرو آنلاین سانس</a>
        <a className="btn btn-ghost" style={{ borderColor: 'rgba(6,37,29,.4)', color: '#06251d' }} href="/club">مشاهده کلوپ ورزشی</a>
      </div>
    </div>
  );
}
