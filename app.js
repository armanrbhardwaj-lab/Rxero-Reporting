const state={
 clients:[
  {id:"KMB001",name:"Kundan Mishthan Bhandar",email:"client@kmb.com",reports:4},
  {id:"ABC002",name:"ABC Sweets",email:"admin@abcsweets.com",reports:3},
  {id:"XYZ003",name:"XYZ Foods",email:"reports@xyzfoods.com",reports:1}
 ],
 reports:[
  {name:"Daily Sales Report",client:"Kundan Mishthan Bhandar",date:"24-Sep-2026",type:"Daily Sales",status:"Published"},
  {name:"Variance Report",client:"Kundan Mishthan Bhandar",date:"24-Sep-2026",type:"Variance",status:"Published"},
  {name:"Purchase Report",client:"ABC Sweets",date:"24-Sep-2026",type:"Purchase",status:"Published"},
  {name:"Monthly Sales Report",client:"Kundan Mishthan Bhandar",date:"23-Sep-2026",type:"Monthly",status:"Published"},
  {name:"Stock Report",client:"XYZ Foods",date:"24-Sep-2026",type:"Stock",status:"Published"}
 ],
 activity:[
  ["Daily Sales Report","Kundan Mishthan Bhandar","Just now"],
  ["Variance Report","Kundan Mishthan Bhandar","12 min ago"],
  ["Purchase Report","ABC Sweets","28 min ago"],
  ["Stock Report","XYZ Foods","1 hr ago"]
 ]
};

function render(){
 document.getElementById("kClients").textContent=state.clients.length;
 document.getElementById("kReports").textContent=state.reports.filter(r=>r.date==="24-Sep-2026").length+3;
 renderClients(); renderActivity(); renderReports(); fillClientSelect();
}
function renderClients(){
 const html=state.clients.map(c=>`<div class="client-row" onclick="showToast('Opened ${esc(c.name)} folder')"><div class="folder">▰</div><div><strong>${esc(c.name)}</strong><small>${c.id} · ${esc(c.email)}</small></div><span class="count">${c.reports} reports</span></div>`).join("");
 document.getElementById("clientCards").innerHTML=html;
 document.getElementById("allClients").innerHTML=state.clients.map(c=>`<div class="card client-card"><div class="folder">▰</div><strong>${esc(c.name)}</strong><small>${c.id} · ${esc(c.email)}</small><div class="client-meta"><span>Daily / Monthly / Analytics</span><b>${c.reports} reports</b></div></div>`).join("");
}
function renderActivity(){
 document.getElementById("activityList").innerHTML=state.activity.slice(0,5).map(a=>`<div class="activity"><i class="dot"></i><div><strong>${esc(a[0])}</strong><small>${esc(a[1])} · ${a[2]} · <span class="portal">Portal published</span></small></div></div>`).join("");
 document.getElementById("fullActivity").innerHTML=state.activity.concat(state.activity).map(a=>`<div class="activity"><i class="dot"></i><div><strong>${esc(a[0])}</strong><small>${esc(a[1])} · ${a[2]} · <span class="portal">Automatically published to client portal</span></small></div></div>`).join("");
}
function renderReports(){
 document.getElementById("reportTable").innerHTML=state.reports.map(r=>`<tr><td><strong>${esc(r.name)}</strong></td><td>${esc(r.client)}</td><td>${r.date}</td><td>${esc(r.type)}</td><td><span class="status">${r.status}</span></td><td class="portal">● Available</td></tr>`).join("");
}
function fillClientSelect(){document.getElementById("uClient").innerHTML=state.clients.map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join("")}
function showView(id){
 document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
 document.getElementById(id).classList.add("active");
 document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.view===id));
 const titles={dashboard:"Reporting Workspace",clients:"Client Folders",reports:"Report Center",activity:"Activity Log"};
 document.getElementById("pageTitle").textContent=titles[id];
}
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>showView(n.dataset.view));
function openUpload(){document.getElementById("uploadModal").classList.add("show");document.getElementById("uDate").value=new Date().toISOString().slice(0,10)}
function openClient(){document.getElementById("clientModal").classList.add("show")}
function closeModal(id){document.getElementById(id).classList.remove("show")}
document.getElementById("uFile").addEventListener("change",e=>{document.getElementById("fileName").textContent=e.target.files[0]?.name||"Choose Excel / CSV / PDF"});
function uploadReport(){
 const client=document.getElementById("uClient").value,type=document.getElementById("uType").value,file=document.getElementById("uFile").files[0];
 if(!file){showToast("Please select a report file");return}
 const d=document.getElementById("uDate").value;
 const formatted=new Date(d+"T12:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}).replaceAll(" ","-");
 state.reports.unshift({name:file.name,client,date:formatted,type,status:"Published"});
 const c=state.clients.find(x=>x.name===client);if(c)c.reports++;
 state.activity.unshift([file.name,client,"Just now"]);
 closeModal("uploadModal");render();showToast("Report uploaded & published to client portal");
}
function createClient(){
 const name=document.getElementById("cName").value.trim(),id=document.getElementById("cId").value.trim(),email=document.getElementById("cEmail").value.trim();
 if(!name||!id){showToast("Enter client name and Client ID");return}
 state.clients.push({id,name,email,reports:0});closeModal("clientModal");render();showToast("Client folder created successfully");
}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
function esc(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
document.getElementById("globalSearch").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase();document.querySelectorAll(".client-row,.client-card,#reportTable tr").forEach(el=>el.style.display=el.textContent.toLowerCase().includes(q)?"":"none");
});
render();
