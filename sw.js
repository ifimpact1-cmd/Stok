const V="stok-v7";
const CORE=["./","./index.html","./manifest.json","https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin!==location.origin&&u.hostname!=="cdnjs.cloudflare.com")return;
  e.respondWith(
    caches.match(r,{ignoreSearch:true}).then(hit=>{
      const net=fetch(r).then(res=>{
        if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}
        return res;
      }).catch(()=>hit||(r.mode==="navigate"?caches.match("./index.html"):undefined));
      return hit||net;
    })
  );
});
