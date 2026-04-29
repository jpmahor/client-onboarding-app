import React, { useMemo, useState } from 'react';

const steps = ['Welcome', 'Business', 'Goals', 'Team', 'Budget', 'Documents', 'Progress', 'FAQ'];

const faqs = [
  { q: 'What documents should I upload?', a: 'Upload your business registration, brand assets, current process docs, and any project requirements you already have.' },
  { q: 'Can I save and continue later?', a: 'Yes. Your onboarding progress is saved automatically after each section.' },
  { q: 'Who reviews my submission?', a: 'Your dedicated onboarding specialist reviews everything and follows up with next steps.' },
];

function getProgress(activeStep, totalSteps) {
  if (!totalSteps || totalSteps < 1) return 0;
  return Math.round(((activeStep + 1) / totalSteps) * 100);
}
function getNextStep(current, totalSteps) { return Math.min(current + 1, totalSteps - 1); }
function getPreviousStep(current) { return Math.max(current - 1, 0); }

function runSmokeTests() {
  console.assert(getProgress(0, 8) === 13, 'progress should round first step to 13%');
  console.assert(getProgress(7, 8) === 100, 'progress should be 100% on final step');
  console.assert(getNextStep(7, 8) === 7, 'next should not exceed final step');
  console.assert(getPreviousStep(0) === 0, 'back should not go below first step');
  console.assert(steps.length === 8, 'onboarding should include all eight requested screens');
}
runSmokeTests();

function Icon({ name, size = 22, className = '' }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className, 'aria-hidden': true };
  const paths = {
    building: <><path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16"/><path d="M9 21v-4h3v4"/><path d="M8 7h1"/><path d="M12 7h1"/><path d="M8 11h1"/><path d="M12 11h1"/><path d="M19 21V9h1a1 1 0 0 1 1 1v11"/><path d="M3 21h18"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
    chevronRight: <path d="m9 18 6-6-6-6"/>,
    clipboard: <><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M8 11h8"/><path d="M8 15h6"/></>,
    fileUp: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4"/><path d="M12 17h.01"/></>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10"/><path d="M9 21v-6h6v6"/></>,
    menu: <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M20 16.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  };
  return <svg {...common}>{paths[name] || paths.help}</svg>;
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button type="button" className={`btn ${variant === 'ghost' ? 'btn-ghost' : 'btn-primary'} ${className}`} {...props}>{children}</button>;
}
function Card({ children }) { return <div className="card">{children}</div>; }

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({ company: '', industry: '', website: '', goals: '', teamSize: '', budget: '' });
  const [files, setFiles] = useState(['Brand Guidelines.pdf', 'Project Brief.docx']);
  const progress = useMemo(() => getProgress(activeStep, steps.length), [activeStep]);
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const next = () => setActiveStep((current) => getNextStep(current, steps.length));
  const back = () => setActiveStep((current) => getPreviousStep(current));

  return <main className="app-shell"><div className="phone">
    <header className="app-header"><div className="header-row"><div className="brand"><div className="logo">CO</div><div><p>Client Portal</p><h1>Onboarding</h1></div></div><button className="menu" aria-label="Open menu"><Icon name="menu" size={20}/></button></div>
      <div className="progress-meta"><span>Progress</span><span>{progress}%</span></div><div className="progress-track"><div className="progress-fill" style={{width:`${progress}%`}}/></div></header>
    <section className="content"><div className="tabs">{steps.map((step,index)=><button key={step} onClick={()=>setActiveStep(index)} className={activeStep===index?'tab active':'tab'}>{step}</button>)}</div><div className="screen">
      {activeStep===0&&<WelcomeScreen onNext={next}/>} {activeStep===1&&<FormCard iconName="building" title="Business details" subtitle="Tell us about your company." fields={[["company","Company name"],["industry","Industry"],["website","Website"]]} form={form} updateField={updateField}/>} {activeStep===2&&<TextAreaCard iconName="clipboard" title="Business goals" subtitle="What outcomes should this project support?" value={form.goals} onChange={(v)=>updateField('goals',v)}/>} {activeStep===3&&<ChoiceCard iconName="users" title="Team size" subtitle="Select the option that best fits your team." options={['1–10','11–50','51–200','200+']} value={form.teamSize} onChange={(v)=>updateField('teamSize',v)}/>} {activeStep===4&&<ChoiceCard iconName="clipboard" title="Budget range" subtitle="This helps us recommend the right scope." options={['Under $5k','$5k–$15k','$15k–$50k','$50k+']} value={form.budget} onChange={(v)=>updateField('budget',v)}/>} {activeStep===5&&<UploadSection files={files} setFiles={setFiles}/>} {activeStep===6&&<ProgressTracker/>} {activeStep===7&&<FAQPage/>}
    </div></section>
    <footer className="footer"><Button variant="ghost" onClick={back} disabled={activeStep===0}>Back</Button><Button onClick={next} disabled={activeStep===steps.length-1}>Continue <Icon name="chevronRight" size={16}/></Button></footer>
  </div></main>;
}

function WelcomeScreen({ onNext }) { return <Card><div className="card-body"><div className="hero-icon"><Icon name="home" size={30}/></div><p className="eyebrow">Welcome to Coastline Operations</p><h2>Let’s set up your client profile.</h2><p className="muted">Complete a few guided steps so our team can understand your business, priorities, budget, and onboarding documents.</p><Button onClick={onNext} className="wide">Start onboarding</Button></div></Card>; }
function SectionHeader({ iconName, title, subtitle }) { return <div className="section-header"><div className="section-icon"><Icon name={iconName}/></div><div><h2>{title}</h2><p>{subtitle}</p></div></div>; }
function FormCard({ iconName, title, subtitle, fields, form, updateField }) { return <Card><div className="card-body stack"><SectionHeader iconName={iconName} title={title} subtitle={subtitle}/>{fields.map(([field,label])=><label key={field} className="field"><span>{label}</span><input value={form[field]||''} onChange={(e)=>updateField(field,e.target.value)} placeholder={`Enter ${label.toLowerCase()}`}/></label>)}</div></Card>; }
function TextAreaCard({ iconName, title, subtitle, value, onChange }) { return <Card><div className="card-body"><SectionHeader iconName={iconName} title={title} subtitle={subtitle}/><textarea value={value||''} onChange={(e)=>onChange(e.target.value)} placeholder="Example: increase qualified leads, modernize operations, improve client reporting..."/></div></Card>; }
function ChoiceCard({ iconName, title, subtitle, options, value, onChange }) { return <Card><div className="card-body"><SectionHeader iconName={iconName} title={title} subtitle={subtitle}/><div className="choice-grid">{options.map(o=><button key={o} onClick={()=>onChange(o)} className={value===o?'choice selected':'choice'}>{o}</button>)}</div></div></Card>; }
function UploadSection({ files, setFiles }) { return <Card><div className="card-body"><SectionHeader iconName="fileUp" title="Document upload" subtitle="Add files your onboarding specialist should review."/><button className="upload-box" onClick={()=>setFiles(c=>[...c,`New Upload ${c.length+1}.pdf`])}><Icon name="upload" size={36}/><strong>Tap to upload documents</strong><span>PDF, DOCX, PNG, or JPG</span></button><div className="file-list">{files.map(file=><div className="file" key={file}><Icon name="check" size={18}/><span>{file}</span></div>)}</div></div></Card>; }
function ProgressTracker() { const items=[['Profile created',true],['Business details',true],['Documents uploaded',true],['Specialist review',false],['Kickoff scheduled',false]]; return <Card><div className="card-body"><SectionHeader iconName="check" title="Progress tracker" subtitle="Track each stage of onboarding in one place."/><div className="timeline">{items.map(([label,done],i)=><div className="timeline-row" key={label}><div className={done?'dot done':'dot'}>{done?<Icon name="check" size={18}/>:i+1}</div><p>{label}</p></div>)}</div></div></Card>; }
function FAQPage() { return <Card><div className="card-body"><SectionHeader iconName="help" title="FAQ" subtitle="Common onboarding questions."/><div className="faq-list">{faqs.map(item=><details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div></div></Card>; }
