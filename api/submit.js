import { Resend } from 'resend';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 try{
  const {lead={},messages=[],files=[]}=req.body||{};
  const transcript=messages.map(m=>`<p><b>${m.role==='assistant'?"Peter's Engineering Assistant":'Buyer'}</b><br>${esc(m.content)}</p>`).join('');
  const fileHtml=files.length?`<h3>Uploaded files</h3><ul>${files.map(f=>`<li>${esc(f.name)} — ${esc(f.url||'stored')}</li>`).join('')}</ul>`:'';
  if(process.env.RESEND_API_KEY){
   const resend=new Resend(process.env.RESEND_API_KEY);
   await resend.emails.send({from:process.env.LEAD_FROM_EMAIL||'PCB Leads <onboarding@resend.dev>',to:process.env.LEAD_EMAIL||'pettypeterpcbdesign@gmail.com',subject:`New PCB project lead — ${lead.name||lead.company||'Website prospect'}`,html:`<h2>New PCB Project Lead</h2><p><b>Name:</b> ${esc(lead.name)}<br><b>Company:</b> ${esc(lead.company)}<br><b>Email:</b> ${esc(lead.email)}<br><b>WhatsApp:</b> ${esc(lead.whatsapp)}</p><h3>Complete unedited conversation</h3>${transcript}${fileHtml}`});
  }
  // Telegram: full transcript is split to respect message size.
  if(process.env.TELEGRAM_BOT_TOKEN&&process.env.TELEGRAM_CHAT_ID){
   const plain=`NEW PCB PROJECT LEAD\nName: ${lead.name||''}\nCompany: ${lead.company||''}\nEmail: ${lead.email||''}\nWhatsApp: ${lead.whatsapp||''}\n\nFULL CONVERSATION\n\n`+messages.map(m=>`${m.role==='assistant'?"Peter's Engineering Assistant":'Buyer'}:\n${m.content}`).join('\n\n')+(files.length?'\n\nFILES\n'+files.map(f=>`${f.name}: ${f.url||'stored'}`).join('\n'):'');
   for(let i=0;i<plain.length;i+=3800) await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:process.env.TELEGRAM_CHAT_ID,text:plain.slice(i,i+3800)})});
  }
  // WhatsApp Cloud API. Configure META_WA_TOKEN and META_WA_PHONE_NUMBER_ID. Recipient defaults to Peter's number.
  if(process.env.META_WA_TOKEN&&process.env.META_WA_PHONE_NUMBER_ID){
   const wa=`New PCB project lead\n${lead.name||''} ${lead.company||''}\n${lead.email||''}\n\nFull transcript has been sent to email and Telegram.`;
   await fetch(`https://graph.facebook.com/v23.0/${process.env.META_WA_PHONE_NUMBER_ID}/messages`,{method:'POST',headers:{'Authorization':`Bearer ${process.env.META_WA_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',to:(process.env.LEAD_WHATSAPP||'2348135003912').replace(/\D/g,''),type:'text',text:{body:wa}})});
  }
  res.status(200).json({ok:true});
 }catch(e){res.status(500).json({error:e.message});}
}
