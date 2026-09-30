import { put } from '@vercel/blob';
export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 try{
  const filename=req.headers['x-filename']||`project-file-${Date.now()}`;
  const blob=await put(`pcb-leads/${Date.now()}-${filename}`,req,{access:'private',token:process.env.BLOB_READ_WRITE_TOKEN});
  res.status(200).json({name:filename,url:blob.url,pathname:blob.pathname});
 }catch(e){res.status(500).json({error:'Upload storage is not configured yet.',detail:e.message});}
}
