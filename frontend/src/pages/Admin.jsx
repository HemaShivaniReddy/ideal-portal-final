import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Admin(){ 
  const [users,setUsers]=useState([]);
  useEffect(()=>{ api.get('/auth/users').then(r=>setUsers(r.data)).catch(()=>{}); },[]);
  const updateRole=async(id,role)=>{ await api.post('/auth/assign-role',{ userId:id, role }); const r=await api.get('/auth/users'); setUsers(r.data); };
  return (<div style={{padding:20}}><h2>Admin Panel</h2>{users.map(u=> (<div key={u._id} style={{border:'1px solid #ccc',padding:8,margin:6}}>{u.email} - {u.role}<select value={u.role} onChange={e=>updateRole(u._id,e.target.value)}><option value='user'>user</option><option value='manager'>manager</option><option value='expert'>expert</option><option value='admin'>admin</option></select></div>))}</div>);
}
export default Admin;
