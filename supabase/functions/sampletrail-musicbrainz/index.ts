// Public music-metadata-only endpoint. Server credentials stay in the runtime.
const ORIGINS = new Set(['https://allablur.github.io','https://sample-trail.laceyfable2.chatgpt.site']);
const URL = Deno.env.get('SUPABASE_URL')!;
const KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MB = 'https://musicbrainz.org/ws/2/';
const TYPE = '9efd9ce9-e702-448b-8e76-641515e8fe62';
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const artist = (r:any) => (r['artist-credit'] || []).map((a:any)=>(a.name || a.artist?.name || '')+(a.joinphrase||'')).join('') || 'Unknown artist';
const meta = (r:any) => ({id:r.id,title:r.title,artist:artist(r),year:r['first-release-date']?.slice(0,4)||null,comment:r.disambiguation||'',isrcs:(r.isrcs||[]).slice(0,10)});
async function db(path:string,method='GET',body?:unknown) {
  const res=await fetch(URL+'/rest/v1/'+path,{method,headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json',...(path==='sampletrail_mb_cache'&&method==='POST'?{Prefer:'resolution=merge-duplicates,return=minimal'}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
  if(!res.ok)throw new Error('Database request failed');
  return res.status===204||res.status===201?null:await res.json();
}
Deno.serve(async req=>{
  const origin=req.headers.get('origin')||'';
  const cors={'Access-Control-Allow-Origin':ORIGINS.has(origin)?origin:'https://allablur.github.io','Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'apikey, authorization, content-type','Vary':'Origin'};
  const send=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(req.method!=='GET'||(origin&&!ORIGINS.has(origin)))return send({error:'Request not allowed'},403);
  try{
    const p=new globalThis.URL(req.url).searchParams,op=p.get('op');
    let upstream:string,key:string;
    if(op==='search'){
      const query=(p.get('q')||'').trim().replace(/\s+/g,' ');
      if(query.length<2||query.length>100)return send({error:'Enter 2–100 characters.'},400);
      // Treat all user words as literal terms rather than Lucene expressions.
      const clean=query.replace(/[+\-!(){}\[\]^"~*?:\\/]|&&|\|\|/g,' ').trim().replace(/\s+/g,' ');
      if(clean.length<2)return send({error:'Enter a track or artist name.'},400);
      key='search:'+clean.toLowerCase();upstream=MB+'recording?fmt=json&limit=12&query='+encodeURIComponent(clean);
    }else if(op==='recording'){
      const id=p.get('id')||'';if(!UUID.test(id))return send({error:'Invalid recording ID.'},400);
      key='recording:'+id.toLowerCase();upstream=MB+'recording/'+id+'?fmt=json&inc=artist-credits+recording-rels+isrcs';
    }else return send({error:'Unknown operation.'},400);
    const rows=await db('sampletrail_mb_cache?cache_key=eq.'+encodeURIComponent(key)+'&expires_at=gt.'+encodeURIComponent(new Date().toISOString())+'&select=payload');
    if(rows?.length)return send({...rows[0].payload,cached:true});
    const claimed=await db('rpc/sampletrail_mb_claim','POST',{});
    if(claimed!==true)return send({error:'MusicBrainz request budget is busy. Wait a moment and retry, or explore the curated collection.'},429);
    const response=await fetch(upstream,{headers:{'User-Agent':'SampleTrail/2.0 (https://github.com/Allablur/SampleTrail)','Accept':'application/json'},signal:AbortSignal.timeout(12000)});
    if(!response.ok)return send({error:response.status===404?'Recording not found.':'MusicBrainz is temporarily unavailable. Try again later.'},response.status===404?404:503);
    const data=await response.json();let payload;
    if(op==='search')payload={recordings:(data.recordings||[]).map(meta)};
    else {const current=meta(data);const relations=(data.relations||[]).filter((r:any)=>r['type-id']===TYPE&&r.recording&&UUID.test(r.recording.id)).map((r:any)=>({recording:meta(r.recording),direction:r.direction==='forward'?'samples':'sampled-by',type:'sample',source:'https://musicbrainz.org/recording/'+data.id+'#relationships'}));payload={recording:current,relations};}
    await db('sampletrail_mb_cache','POST',{cache_key:key,payload,expires_at:new Date(Date.now()+86400000).toISOString()});
    return send({...payload,cached:false});
  }catch{return send({error:'Live catalogue is temporarily unavailable. Curated trails remain available.'},503)}
});
