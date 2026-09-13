const fs=require('fs');
const crypto=require('crypto');
const AdmZip=require('adm-zip');

try{
  const key=Buffer.from(String(process.env.AUTONOMIX_SOURCE_KEY||'').trim(),'base64');
  if(key.length!==32) throw new Error('AUTONOMIX_SOURCE_KEY missing');
  const blob=fs.readFileSync('autonomix.enc');
  const magic=blob.subarray(0,9).toString();
  if(magic!=='AUTONOMIX1') throw new Error('Invalid encrypted source');
  const iv=blob.subarray(9,21),tag=blob.subarray(21,37),enc=blob.subarray(37);
  const decipher=crypto.createDecipheriv('aes-256-gcm',key,iv);
  decipher.setAuthTag(tag);
  const zip=Buffer.concat([decipher.update(enc),decipher.final()]);
  new AdmZip(zip).extractAllTo(process.cwd(),true);
  console.log('AUTONOMIX encrypted source installed');
}catch(e){ console.error(e); process.exit(1); }
