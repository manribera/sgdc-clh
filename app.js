const API_URL = "https://script.google.com/macros/s/AKfycbx_Lz5AvI8Ge9DQhKVvXDZB_7CTJ8cxXmwbuoJqckwCRImqNrqQsRxrUZHqidZuw6e2nw/exec";

const ICONS = {
  inicio:`<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>`,
  expedientes:`<svg viewBox="0 0 24 24"><path d="M3 6h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M7 13h10M7 17h6"/></svg>`,
  documentos:`<svg viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h6"/></svg>`,
  seguimiento:`<svg viewBox="0 0 24 24"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15l3-3 3 2 5-7"/></svg>`,
  asambleas:`<svg viewBox="0 0 24 24"><path d="M3 10h18L12 4z"/><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 18h18"/></svg>`,
  info:`<svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>`,
  perfil:`<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`
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
  solicitudes:[],
  expedientes:[]
};

const nav = [
  ["inicio",ICONS.inicio,"Inicio"],
  ["expedientes",ICONS.expedientes,"Expedientes"],
  ["nuevo","＋",""],
  ["seguimiento",ICONS.seguimiento,"Seguimiento"],
  ["perfil",ICONS.perfil,"Perfil"]
];

async function api(action, data={}, method="POST") {
  if(method==="GET") {
    const res = await fetch(API_URL + "?action=" + encodeURIComponent(action));
    return await res.json();
  }
  const res = await fetch(API_URL, {
    method:"POST",
    body:JSON.stringify({action, ...data})
  });
  return await res.json();
}

function setView(v){ state.view=v; render(); }
function badge(t){ return `<span class="badge ${String(t||'').toLowerCase()}">${t||''}</span>`; }

function shell(content){
  return `<div class="app"><div class="frame">
    <button class="admin-link" onclick="setView('admin')">Panel Junta</button>
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

function titulo(icon,text){ return `<h2 class="page-title">${icon} ${text}</h2>`; }

function inicio(){
  const saludo = state.user ? `Bienvenido, ${state.user.NOMBRE || 'usuario'}` : "Portal informativo de la Junta Fiscalizadora";
  return shell(`
    <section class="hero">
      <div>
        <h1>Junta Fiscalizadora<br>Condominio Los Helechos</h1>
        <p>${saludo}</p>
      </div>
    </section>
    <section class="cards">
      ${card(ICONS.expedientes,"Expedientes","Organización de casos, asuntos y procesos de fiscalización.","expedientes")}
      ${card(ICONS.documentos,"Documentos","Buscador documental, oficios, contratos, actas y respaldos.","documentos")}
      ${card(ICONS.seguimiento,"Seguimiento","Control de avance de gestiones, compromisos y acuerdos.","seguimiento")}
      ${card(ICONS.asambleas,"Asambleas","Convocatorias, edictos, actas, poderes y acuerdos.","asambleas")}
      ${card(ICONS.info,"Información a propietarios","Comunicados, circulares, avisos e informes de la Junta.","informacion")}
      ${card(ICONS.perfil,"Mi perfil","Ingreso, registro y datos del usuario.","perfil")}
    </section>
  `);
}

async function cargarExpedientes(){
  try {
    const res = await api("listarExpedientes",{},"GET");
    if(res.ok) state.expedientes = res.data || [];
  } catch(e) {}
}

function expedientes(){
  return shell(`
    ${titulo(ICONS.expedientes,"Expedientes")}
    <section class="panel">
      <button class="btn small" onclick="setView('nuevoExpediente')">Nuevo expediente</button>
      <br><br>
      <div class="doc-list">
        ${state.expedientes.length ? state.expedientes.map(e=>`
          <article class="doc">
            <div>
              <h3>${e.CODIGO_EXPEDIENTE || e.ID_EXPEDIENTE} · ${e.NOMBRE || ""}</h3>
              <p>${e.TIPO || ""} · ${e.DESCRIPCION || ""}</p>
              <p><b>Responsable:</b> ${e.RESPONSABLE || ""}</p>
            </div>
            <div>${badge(e.ESTADO || "ABIERTO")}</div>
          </article>
        `).join("") : "<p>No hay expedientes registrados.</p>"}
      </div>
    </section>
  `);
}

function nuevoExpediente(){
  return shell(`
    ${titulo(ICONS.expedientes,"Nuevo expediente")}
    <section class="panel">
      <div class="form">
        <label>Código</label><input id="expCodigo" placeholder="EXP-2026-001">
        <label>Nombre</label><input id="expNombre" placeholder="Ejemplo: Fiscalización Administración MARMAT">
        <label>Tipo</label><select id="expTipo"><option>Fiscalización</option><option>Asamblea</option><option>Proyecto</option><option>Finanzas</option><option>Legal</option><option>Otro</option></select>
        <label>Descripción</label><textarea id="expDescripcion"></textarea>
        <label>Responsable</label><input id="expResponsable" placeholder="Junta Fiscalizadora">
        <button class="btn" onclick="guardarExpediente()">Guardar expediente</button>
        <button class="btn ghost" onclick="setView('expedientes')">Cancelar</button>
      </div>
    </section>
  `);
}

async function guardarExpediente(){
  try {
    const data = {
      codigo: expCodigo.value.trim(),
      nombre: expNombre.value.trim(),
      tipo: expTipo.value,
      descripcion: expDescripcion.value.trim(),
      responsable: expResponsable.value.trim(),
      creadoPor: state.user ? state.user.CORREO : "PANEL JUNTA"
    };
    if(!data.nombre) return alert("Debe indicar el nombre del expediente.");
    const res = await api("registrarExpediente", data);
    if(!res.ok) throw new Error(res.error || "No se pudo guardar.");
    alert(res.mensaje || "Expediente registrado.");
    await cargarExpedientes();
    setView("expedientes");
  } catch(err) { alert(err.message); }
}

function documentos(){
  return shell(`
    ${titulo(ICONS.documentos,"Documentos")}
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

function seguimiento(){
  return shell(`
    ${titulo(ICONS.seguimiento,"Seguimiento")}
    <section class="panel">
      <p>Control de avance de gestiones, acuerdos, requerimientos, proyectos y compromisos de administración.</p>
      <div class="modules">
        <div class="module-card"><h3>Pendientes</h3><ul><li>Requerimientos sin respuesta</li><li>Acuerdos por ejecutar</li></ul></div>
        <div class="module-card"><h3>En proceso</h3><ul><li>Gestiones activas</li><li>Proyectos con seguimiento</li></ul></div>
        <div class="module-card"><h3>Finalizados</h3><ul><li>Gestiones cerradas</li><li>Evidencia documental</li></ul></div>
        <div class="module-card"><h3>Vinculados</h3><ul><li>Expedientes</li><li>Documentos asociados</li></ul></div>
      </div>
    </section>
  `);
}

function asambleas(){
  return shell(`
    ${titulo(ICONS.asambleas,"Asambleas")}
    <section class="panel">
      <div class="modules">
        <div class="module-card"><h3>Convocatorias</h3><ul><li>Ordinarias</li><li>Extraordinarias</li></ul></div>
        <div class="module-card"><h3>Edictos</h3><ul><li>Publicaciones oficiales</li><li>Respaldo de publicación</li></ul></div>
        <div class="module-card"><h3>Actas</h3><ul><li>Actas aprobadas</li><li>Actas pendientes</li></ul></div>
        <div class="module-card"><h3>Documentación</h3><ul><li>Orden del día</li><li>Poderes</li><li>Lista de asistencia</li><li>Acuerdos</li></ul></div>
      </div>
    </section>
  `);
}

function informacion(){
  return shell(`
    ${titulo(ICONS.info,"Información a propietarios")}
    <section class="panel">
      <div class="modules">
        <div class="module-card"><h3>Comunicados</h3><ul><li>Comunicaciones oficiales de la Junta</li></ul></div>
        <div class="module-card"><h3>Circulares</h3><ul><li>Información general</li><li>Recordatorios</li></ul></div>
        <div class="module-card"><h3>Avisos</h3><ul><li>Alertas</li><li>Asuntos urgentes</li></ul></div>
        <div class="module-card"><h3>Informes</h3><ul><li>Resumen de actuaciones</li><li>Información documental</li></ul></div>
      </div>
    </section>
  `);
}

function nuevo(){
  return shell(`
    ${titulo(ICONS.seguimiento,"Nuevo seguimiento")}
    <section class="panel">
      <p>En la siguiente fase se activará el registro de seguimientos en Google Sheets.</p>
      <button class="btn ghost" onclick="setView('seguimiento')">Volver</button>
    </section>
  `);
}

function perfil(){
  if(!state.user){
    return shell(`
      ${titulo(ICONS.perfil,"Ingreso de usuario")}
      <section class="panel">
        <div class="form">
          <label>Correo electrónico</label><input id="correoLogin" placeholder="correo@ejemplo.com">
          <label>Contraseña</label><input id="claveLogin" type="password" placeholder="Contraseña">
          <button class="btn" onclick="login()">Ingresar</button>
          <button class="btn ghost" onclick="setView('registro')">Registrarme</button>
        </div>
      </section>
    `);
  }
  return shell(`
    ${titulo(ICONS.perfil,"Mi perfil")}
    <section class="panel profile-card">
      <div class="avatar">${ICONS.perfil}</div>
      <h2>${state.user.NOMBRE || ""} ${state.user.APELLIDO_1 || ""} ${state.user.APELLIDO_2 || ""}</h2>
      <p><b>Filial:</b> ${state.user.FILIAL || ""}</p>
      <p><b>Correo:</b> ${state.user.CORREO || ""}</p>
      <p><b>Teléfono:</b> ${state.user.TELEFONO || "No registrado"}</p>
      <p><b>Estado:</b> ${state.user.ESTADO || ""}</p>
      <button class="btn ghost" onclick="logout()">Cerrar sesión</button>
    </section>
  `);
}

async function login(){
  try{
    const res = await api("loginUsuario", { correo:correoLogin.value.trim(), clave:claveLogin.value.trim() });
    if(!res.ok) throw new Error(res.error || "No se pudo ingresar.");
    state.user = res.usuario;
    localStorage.setItem("sigefi_user", JSON.stringify(res.usuario));
    setView("inicio");
  }catch(err){ alert(err.message); }
}

function logout(){
  state.user=null;
  localStorage.removeItem("sigefi_user");
  setView("inicio");
}

function registro(){
  return shell(`
    ${titulo(ICONS.perfil,"Registro de usuario")}
    <section class="panel">
      <div class="form two">
        <div><label>Nombre</label><input id="regNombre"></div>
        <div><label>Primer apellido</label><input id="regApellido1"></div>
        <div><label>Segundo apellido</label><input id="regApellido2"></div>
        <div><label>Cédula</label><input id="regCedula"></div>
        <div><label>Teléfono</label><input id="regTelefono"></div>
        <div><label>Finca / Filial</label><input id="regFilial"></div>
        <div class="full"><label>Correo</label><input id="regCorreo"></div>
        <div class="full"><label>Contraseña</label><input id="regClave" type="password"></div>
        <button class="btn full" onclick="registrarUsuario()">Enviar registro</button>
      </div>
    </section>
  `);
}

async function registrarUsuario(){
  try{
    const data = {
      nombre:regNombre.value.trim(),
      apellido1:regApellido1.value.trim(),
      apellido2:regApellido2.value.trim(),
      cedula:regCedula.value.trim(),
      telefono:regTelefono.value.trim(),
      filial:regFilial.value.trim(),
      correo:regCorreo.value.trim(),
      clave:regClave.value.trim()
    };
    const res = await api("registrarUsuario", data);
    if(!res.ok) throw new Error(res.error || "No se pudo registrar.");
    alert(res.mensaje || "Registro recibido. Queda pendiente de aprobación.");
    setView("perfil");
  }catch(err){ alert(err.message); }
}

async function admin(){
  let usuarios=[];
  try{ const res=await api("listarUsuarios",{},"GET"); if(res.ok) usuarios=res.data||[]; }catch(e){}
  const pendientes=usuarios.filter(u=>String(u.ESTADO).toUpperCase()==="PENDIENTE");
  const activos=usuarios.filter(u=>String(u.ESTADO).toUpperCase()==="ACTIVO");
  return shell(`
    ${titulo(ICONS.perfil,"Panel Junta")}
    <section class="grid three">
      <div class="stat"><span>Usuarios activos</span><strong>${activos.length}</strong></div>
      <div class="stat"><span>Usuarios pendientes</span><strong>${pendientes.length}</strong></div>
      <div class="stat"><span>Expedientes</span><strong>${state.expedientes.length}</strong></div>
    </section>
    <section class="panel">
      <h3>Usuarios pendientes</h3>
      ${pendientes.length ? pendientes.map(u=>`
        <div class="doc">
          <div><h3>${u.NOMBRE||""} ${u.APELLIDO_1||""}</h3><p>${u.CORREO||""} · ${u.FILIAL||""}</p></div>
          <div><button class="btn small" onclick="aprobarUsuario('${u.ID_USUARIO}')">Aprobar</button></div>
        </div>
      `).join("") : "<p>No hay usuarios pendientes.</p>"}
    </section>
  `);
}

async function aprobarUsuario(id){
  const res=await api("aprobarUsuario", {idUsuario:id, aprobadoPor:"PANEL JUNTA"});
  if(!res.ok) return alert(res.error||"No se pudo aprobar.");
  alert("Usuario aprobado.");
  setView("admin");
}

function render(){
  const routes={inicio,expedientes,nuevoExpediente,documentos,seguimiento,nuevo,perfil,registro,asambleas,informacion,admin};
  const result=(routes[state.view]||inicio)();
  if(result && typeof result.then==="function"){
    result.then(html=>{document.getElementById("app").innerHTML=html; if(state.view==="documentos") filterDocs();});
  }else{
    document.getElementById("app").innerHTML=result;
    if(state.view==="documentos") filterDocs();
  }
}

const saved=localStorage.getItem("sigefi_user");
if(saved){ try{state.user=JSON.parse(saved);}catch(e){localStorage.removeItem("sigefi_user");} }

cargarExpedientes().then(render);
