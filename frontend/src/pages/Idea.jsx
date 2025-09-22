import React, { useEffect, useState } from 'react'; import api from '../services/api';
export default function Idea(){ 
  const [ideas,setIdeas]=useState([]); const [title,setTitle]=useState(''); const [comment,setComment]=useState('');
  const fetch=async()=>{ const r=await api.get('/ideas'); setIdeas(r.data); };
  useEffect(()=>{ fetch(); },[]);
  const submit=async()=>{ await api.post('/ideas',{title}); setTitle(''); fetch(); };
  const addComment=async(id)=>{ await api.post(`/ideas/${id}/comments`,{text:comment}); setComment(''); fetch(); };
  return (<div style={{padding:20}}><h3>Submit Idea</h3><input value={title} onChange={e=>setTitle(e.target.value)} placeholder='Title' /> <button onClick={submit}>Submit</button><h3>Ideas</h3>{ideas.map(i=>(<div key={i._id} style={{border:'1px solid #ccc',padding:8,margin:6}}><b>{i.title}</b><p>Status: {i.status}</p><ul>{(i.comments||[]).map((c,idx)=>(<li key={idx}>{c.text}</li>))}</ul><input value={comment} onChange={e=>setComment(e.target.value)} placeholder='Comment' /> <button onClick={()=>addComment(i._id)}>Add</button></div>))}</div>);
}
