const fs=require('fs');
const path=require('path');
const AdmZip=require('adm-zip');

(async()=>{
  const url=String(process.env.AUTONOMIX_SOURCE_URL||'').trim();
  if(!/^https:\/\//.test(url)) throw new Error('AUTONOMIX_SOURCE_URL missing');
  const r=await fetch(url);
  if(!r.ok) throw new Error('download failed '+r.status);
  const buf=Buffer.from(await r.arrayBuffer());
  const zipPath=path.join(process.cwd(),'autonomix.zip');
  fs.writeFileSync(zipPath,buf);
  new AdmZip(zipPath).extractAllTo(process.cwd(),true);
  fs.unlinkSync(zipPath);
  console.log('AUTONOMIX source installed');
})().catch(e=>{console.error(e);process.exit(1)});
