import { SYSTEM_PROMPT } from '../lib/playbook.js';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:'OPENAI_API_KEY is not configured yet.'});
  try{
    const {messages=[], lead={}}=req.body||{};
    const input=[{role:'system',content:SYSTEM_PROMPT+`\n\nKnown lead data: ${JSON.stringify(lead)}`}];
    for(const m of messages.slice(-30)) input.push({role:m.role==='assistant'?'assistant':'user',content:String(m.content||'')});
    const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-5.6-luna',input,reasoning:{effort:'low'},max_output_tokens:900})});
    const data=await r.json();
    if(!r.ok) return res.status(r.status).json({error:data?.error?.message||'AI request failed'});
    const text=data.output_text || (data.output||[]).flatMap(x=>x.content||[]).map(x=>x.text||'').join('').trim();
    return res.status(200).json({reply:text||'Please tell me a little more about the project requirements.'});
  }catch(e){return res.status(500).json({error:e.message});}
}
