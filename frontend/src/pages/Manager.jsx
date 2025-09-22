import React, { useEffect, useState } from 'react';
import api from '../services/api';
function Manager(){ 
  const [ideas,setIdeas]=useState([]);
  useEffect(()=>{ api.get('/ideas').then(r=>setIdeas(r.data)).catch(()=>{}); },[]);
  const update=async(id,status)=>{ await api.put(`/ideas/${id}/status`,{status}); const r=await api.get('/ideas'); setIdeas(r.data); };
  return (<div style={{padding:20}}><h2>Manager</h2>{ideas.map(i=>(<div key={i._id} style={{border:'1px solid #ddd',padding:8,margin:6}}><b>{i.title}</b><p>{i.status}</p><button onClick={()=>update(i._id,'approved')}>Approve</button><button onClick={()=>update(i._id,'rejected')}>Reject</button><button onClick={()=>update(i._id,'on-hold')}>Hold</button></div>))}</div>);
} export default Manager;
