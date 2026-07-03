const API_URL = "https://script.google.com/macros/s/AKfycbwNuj_9k0oohl9ArHr7j6nJ0wuGjcoguexEfjf0H1hEcXjQ9SCaCmLcoYoHOlE5rLof5A/exec";

const ICONS = {
  inicio:`<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>`,
  documentos:`<svg viewBox="0 0 24 24"><path d="M3 6h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
  solicitudes:`<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>`,
  perfil:`<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
  asambleas:`<svg viewBox="0 0 24 24"><path d="M3 10h18L12 4z"/><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 18h18"/></svg>`,
  comunicados:`<svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>`
};

const state = {
  view:"inicio",
  user:null,
  documentos:[
    {codigo:"JF-001-2026",fecha:"03/06/2026",titulo:"Solicitud de Convocatoria a Asamblea Extraordinaria",area:"Asambleas",exp:"EXP-2026-002",estado:"Vigente"},
    {codigo:"ED-001-2026",fecha:"30/06/2026",titulo:"Edicto de Convocatoria en La Gaceta",area:"Asambleas",exp:"EXP-2026-002",estado:"Publicado"},
    {codigo:"ADM-001-2026",fecha:"25/05/2026",titulo:"Plan de trabajo administrativo",area:"Administración",exp:"EXP-2026-001",estado:"Vigente"},
    {codigo:"JF-ACC-2026",fecha:"22/06/2026",titulo:"Solicitud de información sobre obras del sistema de acceso",area:"Proyectos",exp:"EXP-2026-001",estado:"Vigente"}
  ],
  solicitudes:[]
};

const nav = [
  ["inicio",ICONS.inicio,"Inicio"],
  ["documentos",ICONS.documentos,"Documentos"],
  ["nuevo","＋",""],
  ["solicitudes",ICONS.solicitudes,"Solicitudes"],
  ["perfil",ICONS.perfil,"Perfil"]
];

async function api(action, data = {}, method = "POST") {
  if (method === "GET") {
    const res = await fetch(API_URL + "?action=" + encodeURIComponent(action));
    return await res.json();
  }
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action, ...data })
  });
  return await res.json();
}

function setView(v){ state.view=v; render(); }
function badge(t){ return `<span class="badge">${t}</span>`; }

function shell(content){
  return `<div class="app"><div class="frame">
    <button class="admin-link" onclick="setView('admin')">Admin</button>
    <div class="content">${content}</div>
    <nav class="bottom-nav">
      ${nav.map(n=> n[0]==="nuevo"
        ? `<button class="plus" onclick="setView('nuevo')">+</button>`
        : `<button class="${state.view===n[0]?'active':''}" onclick="setView('${n[0]}')"><strong>${n[1]}</strong>${n[2]}</button>`
      ).join("")}
    </nav>
  </div></div>`;
}

function card(icon,title,text,view){
  return `<button class="action-card" onclick="setView('${view}')">
    <div class="icon">${icon}</div>
    <h3>${title}</h3>
    <p>${text}</p>
    <span class="arrow">›</span>
  </button>`;
}

function inicio(){
  const nombre = state.user ? (state.user.NOMBRE || "usuario") : "";
  const saludo = nombre ? `Bienvenido, ${nombre}` : "Bienvenido";
  return shell(`
    <section class="hero">
      <h1>Condominio<br>Los Helechos</h1>
      <p>${saludo}</p>
    </section>
    <section class="cards">
      ${card(ICONS.solicitudes,"Nueva solicitud","Reporte una avería, consulta, queja o sugerencia.","nuevo")}
      ${card(ICONS.documentos,"Documentos","Consulte documentos y expedientes del condominio.","documentos")}
      ${card(ICONS.asambleas,"Asambleas","Convocatorias, edictos, actas y acuerdos.","asambleas")}
      ${card(ICONS.comunicados,"Comunicados","Circulares, avisos e información general.","comunicados")}
      ${card(ICONS.perfil,"Mi perfil","Ingreso, registro y datos del usuario.","perfil")}
    </section>
  `);
}

function documentos(){
  return shell(`
    <h2 class="page-title">${ICONS.documentos} Archivo documental</h2>
    <section class="panel">
      <div class="searchbar">
        <input id="q" placeholder="Buscar por MARMAT, Asamblea, contrato, fecha..." oninput="filterDocs()">
        <select id="area" onchange="filterDocs()"><option value="">Todas las áreas</option><option>Asambleas</option><option>Administración</option><option>Proyectos</option></select>
        <select id="estado" onchange="filterDocs()"><option value="">Todos los estados</option><option>Vigente</option><option>Publicado</option></select>
      </div>
      <div id="docList" class="doc-list"></div>
    </section>
  `);
}

function filterDocs(){
  const q=(document.getElementById("q")?.value||"").toLowerCase();
  const area=document.getElementById("area")?.value||"";
  const estado=document.getElementById("estado")?.value||"";
  const docs=state.documentos.filter(d=>{
    const txt=`${d.codigo} ${d.fecha} ${d.titulo} ${d.area} ${d.exp}`.toLowerCase();
    return (!q||txt.includes(q)) && (!area||d.area===area) && (!estado||d.estado===estado);
  });
  document.getElementById("docList").innerHTML = docs.map(d=>`
    <article class="doc">
      <div><h3>${d.codigo} · ${d.titulo}</h3><p>${d.fecha} · ${d.area} · ${d.exp}</p></div>
      <div>${badge(d.estado)}</div>
    </article>
  `).join("") || "<p>No hay documentos.</p>";
}

function nuevo(){
  if(!state.user){
    return shell(`<h2 class="page-title">${ICONS.perfil} Ingreso requerido</h2><section class="panel"><p>Para enviar una solicitud debe iniciar sesión o registrarse.</p><button class="btn" onclick="setView('perfil')">Ingresar</button> <button class="btn ghost" onclick="setView('registro')">Registrarme</button></section>`);
  }
  return shell(`
    <h2 class="page-title">${ICONS.solicitudes} Nueva solicitud</h2>
    <section class="panel">
      <div class="form">
        <label>Tipo de solicitud</label><select id="tipo"><option>Consulta</option><option>Avería</option><option>Queja</option><option>Sugerencia</option></select>
        <label>Prioridad</label><select id="prioridad"><option>Media</option><option>Baja</option><option>Alta</option><option>Urgente</option></select>
        <label>Asunto</label><input id="asunto" placeholder="Ejemplo: Fuga de agua">
        <label>Descripción</label><textarea id="descripcion" placeholder="Describa detalladamente la situación..."></textarea>
        <button class="btn" onclick="guardarSolicitud()">Enviar solicitud</button>
        <button class="btn ghost" onclick="setView('inicio')">Cancelar</button>
      </div>
    </section>
  `);
}

async function guardarSolicitud(){
  const asunto = document.getElementById("asunto").value.trim();
  if(!asunto){ alert("Debe indicar el asunto."); return; }
  try {
    const data = {
      idUsuario: state.user.ID_USUARIO,
      nombreUsuario: `${state.user.NOMBRE || ""} ${state.user.APELLIDO_1 || ""}`.trim(),
      tipo: document.getElementById("tipo").value,
      categoria: "",
      asunto,
      descripcion: document.getElementById("descripcion").value,
      prioridad: document.getElementById("prioridad").value,
      ubicacion: state.user.FILIAL || ""
    };
    const res = await api("registrarSolicitud", data);
    if(!res.ok) throw new Error(res.error || "No se pudo guardar la solicitud.");
    alert(res.mensaje || "Solicitud registrada correctamente.");
    await cargarSolicitudes();
    setView("solicitudes");
  } catch(err) { alert(err.message); }
}

async function cargarSolicitudes(){
  if(!state.user) return;
  const res = await api("listarSolicitudes", { idUsuario: state.user.ID_USUARIO, rol: state.user.ROL });
  if(res.ok) state.solicitudes = res.data || [];
}

function solicitudes(){
  if(!state.user){
    return shell(`<h2 class="page-title">${ICONS.solicitudes} Mis solicitudes</h2><section class="panel"><p>Debe iniciar sesión para ver sus solicitudes.</p><button class="btn" onclick="setView('perfil')">Ingresar</button></section>`);
  }
  return shell(`
    <h2 class="page-title">${ICONS.solicitudes} Mis solicitudes</h2>
    <section class="panel">
      ${state.solicitudes.length ? state.solicitudes.map(s=>`
        <div class="doc">
          <div><h3>${s.ASUNTO || ""}</h3><p><b>Tipo:</b> ${s.TIPO || ""}</p><p><b>Prioridad:</b> ${s.PRIORIDAD || ""}</p><p><b>Fecha:</b> ${s.FECHA_CREACION || ""}</p><p><b>Estado:</b> ${s.ESTADO || ""}</p><hr><p>${s.DESCRIPCION || ""}</p></div>
          <div>${badge(s.ESTADO || "Pendiente")}</div>
        </div>`).join("") : "<p>No tiene solicitudes registradas.</p>"}
    </section>
  `);
}

function perfil(){
  if(!state.user){
    return shell(`<h2 class="page-title">${ICONS.perfil} Ingreso de usuario</h2><section class="panel"><div class="form"><label>Correo electrónico</label><input id="correoLogin" placeholder="correo@ejemplo.com"><label>Contraseña</label><input id="claveLogin" type="password" placeholder="Contraseña"><button class="btn" onclick="login()">Ingresar</button><button class="btn ghost" onclick="setView('registro')">Registrarme</button></div></section>`);
  }
  return shell(`<h2 class="page-title">${ICONS.perfil} Mi perfil</h2><section class="panel profile-card"><div class="avatar">${ICONS.perfil}</div><h2>${state.user.NOMBRE || ""} ${state.user.APELLIDO_1 || ""} ${state.user.APELLIDO_2 || ""}</h2><p><b>Filial:</b> ${state.user.FILIAL || ""}</p><p><b>Correo:</b> ${state.user.CORREO || ""}</p><p><b>Teléfono:</b> ${state.user.TELEFONO || "No registrado"}</p><p><b>Estado:</b> ${state.user.ESTADO || ""}</p><button class="btn ghost" onclick="logout()">Cerrar sesión</button></section>`);
}

async function login(){
  try {
    const res = await api("loginUsuario", { correo:document.getElementById("correoLogin").value.trim(), clave:document.getElementById("claveLogin").value.trim() });
    if(!res.ok) throw new Error(res.error || "No se pudo ingresar.");
    state.user = res.usuario;
    localStorage.setItem("sigeco_user", JSON.stringify(res.usuario));
    await cargarSolicitudes();
    setView("inicio");
  } catch(err) { alert(err.message); }
}

function logout(){ state.user=null; state.solicitudes=[]; localStorage.removeItem("sigeco_user"); setView("inicio"); }

function registro(){
  return shell(`<h2 class="page-title">${ICONS.perfil} Registro de usuario</h2><section class="panel"><div class="form"><label>Nombre</label><input id="regNombre"><label>Primer apellido</label><input id="regApellido1"><label>Segundo apellido</label><input id="regApellido2"><label>Cédula</label><input id="regCedula"><label>Teléfono</label><input id="regTelefono"><label>Finca / Filial</label><input id="regFilial"><label>Correo</label><input id="regCorreo"><label>Contraseña</label><input id="regClave" type="password"><button class="btn" onclick="registrarUsuario()">Enviar registro</button></div></section>`);
}

async function registrarUsuario(){
  try {
    const data = { nombre:regNombre.value.trim(), apellido1:regApellido1.value.trim(), apellido2:regApellido2.value.trim(), cedula:regCedula.value.trim(), telefono:regTelefono.value.trim(), filial:regFilial.value.trim(), correo:regCorreo.value.trim(), clave:regClave.value.trim() };
    const res = await api("registrarUsuario", data);
    if(!res.ok) throw new Error(res.error || "No se pudo registrar.");
    alert(res.mensaje || "Registro recibido. Queda pendiente de aprobación.");
    setView("perfil");
  } catch(err) { alert(err.message); }
}

function asambleas(){ return shell(`<h2 class="page-title">${ICONS.asambleas} Asambleas</h2><section class="panel"><div class="modules"><div class="module-card"><h3>Convocatorias</h3><ul><li>Ordinarias</li><li>Extraordinarias</li></ul></div><div class="module-card"><h3>Edictos</h3><ul><li>Publicaciones oficiales</li><li>Respaldo de publicación</li></ul></div><div class="module-card"><h3>Actas</h3><ul><li>Actas aprobadas</li><li>Actas pendientes</li></ul></div><div class="module-card"><h3>Documentación</h3><ul><li>Orden del día</li><li>Poderes</li><li>Lista de asistencia</li><li>Acuerdos</li></ul></div></div></section>`); }
function comunicados(){ return shell(`<h2 class="page-title">${ICONS.comunicados} Comunicados</h2><section class="panel"><div class="modules"><div class="module-card"><h3>Circulares</h3><ul><li>Información general</li><li>Recordatorios</li></ul></div><div class="module-card"><h3>Avisos</h3><ul><li>Mantenimiento</li><li>Emergencias</li><li>Horarios</li></ul></div><div class="module-card"><h3>Boletines</h3><ul><li>Noticias</li><li>Actividades comunitarias</li></ul></div><div class="module-card"><h3>Información a propietarios</h3><ul><li>Comunicaciones informativas</li><li>Documentos de interés común</li></ul></div></div></section>`); }

async function admin(){
  let usuarios = [];
  try { const res = await api("listarUsuarios", {}, "GET"); if(res.ok) usuarios=res.data||[]; } catch(e){}
  const pendientes=usuarios.filter(u=>String(u.ESTADO).toUpperCase()==="PENDIENTE");
  const activos=usuarios.filter(u=>String(u.ESTADO).toUpperCase()==="ACTIVO");
  return shell(`<h2 class="page-title">⚙ Panel administrativo</h2><section class="grid three"><div class="stat"><span>Usuarios activos</span><strong>${activos.length}</strong></div><div class="stat"><span>Usuarios pendientes</span><strong>${pendientes.length}</strong></div><div class="stat"><span>Solicitudes</span><strong>${state.solicitudes.length}</strong></div></section><section class="panel"><h3>Usuarios pendientes</h3>${pendientes.length ? pendientes.map(u=>`<div class="doc"><div><h3>${u.NOMBRE||""} ${u.APELLIDO_1||""}</h3><p>${u.CORREO||""} · ${u.FILIAL||""}</p></div><div><button class="btn" onclick="aprobarUsuario('${u.ID_USUARIO}')">Aprobar</button></div></div>`).join("") : "<p>No hay usuarios pendientes.</p>"}</section>`);
}

async function aprobarUsuario(id){ const res=await api("aprobarUsuario", {idUsuario:id, aprobadoPor:"ADMIN"}); if(!res.ok) return alert(res.error||"No se pudo aprobar."); alert("Usuario aprobado."); setView("admin"); }

function render(){
  const routes={inicio,documentos,solicitudes,nuevo,perfil,registro,asambleas,comunicados,admin};
  const result=(routes[state.view]||inicio)();
  if(result && typeof result.then === "function") result.then(html=>{document.getElementById("app").innerHTML=html; if(state.view==="documentos") filterDocs();});
  else { document.getElementById("app").innerHTML=result; if(state.view==="documentos") filterDocs(); }
}

const saved=localStorage.getItem("sigeco_user");
if(saved){ try{state.user=JSON.parse(saved); cargarSolicitudes();}catch(e){localStorage.removeItem("sigeco_user");} }
render();
