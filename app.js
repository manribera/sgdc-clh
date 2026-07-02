const state = {
  view:"inicio",
  user:{nombre:"Carlos Castro", filial:"Casa 10", correo:"cb230494@gmail.com", telefono:"86161763", estado:"Activo"},
  documentos:[
    {codigo:"JF-001-2026",fecha:"03/06/2026",titulo:"Solicitud de Convocatoria a Asamblea Extraordinaria",area:"Asambleas",exp:"EXP-2026-002",estado:"Vigente"},
    {codigo:"ED-001-2026",fecha:"30/06/2026",titulo:"Edicto de Convocatoria en La Gaceta",area:"Asambleas",exp:"EXP-2026-002",estado:"Publicado"},
    {codigo:"ADM-001-2026",fecha:"25/05/2026",titulo:"Plan de trabajo administrativo",area:"Administración",exp:"EXP-2026-001",estado:"Vigente"},
    {codigo:"JF-ACC-2026",fecha:"22/06/2026",titulo:"Solicitud de información sobre obras del sistema de acceso",area:"Proyectos",exp:"EXP-2026-001",estado:"Vigente"}
  ],
  solicitudes:[
    {asunto:"Fuga de agua",tipo:"Avería",prioridad:"Alta",responsable:"Pendiente de asignación",fecha:"25/06/2026, 05:20 p. m.",estado:"En proceso",desc:"Nada"}
  ],
  timeline:[
    ["03 junio","Solicitud de convocatoria a Asamblea Extraordinaria presentada por propietarios."],
    ["15 junio","Seguimiento formal a la solicitud de convocatoria."],
    ["22 junio","Solicitud de aclaración sobre reunión del 19 de junio."],
    ["22 junio","Solicitud de información sobre obras del sistema de acceso."],
    ["30 junio","Publicación del edicto en el Diario Oficial La Gaceta."],
    ["17 julio","Fecha prevista para Asamblea Extraordinaria."]
  ]
};

const nav = [
  ["inicio","🏠","Inicio"],
  ["documentos","📂","Documentos"],
  ["nuevo","＋",""],
  ["solicitudes","📋","Solicitudes"],
  ["perfil","👤","Perfil"]
];

function setView(v){state.view=v;render();}
function badge(t){return `<span class="badge">${t}</span>`}

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

function inicio(){
  return shell(`
    <section class="hero">
      <h1>Condominio<br>Los Helechos</h1>
      <p>Bienvenido, ${state.user.nombre.split(" ")[0]}</p>
    </section>
    <section class="cards">
      ${card("📝","Nueva solicitud","Reporte una avería, consulta, queja o sugerencia.","nuevo")}
      ${card("📋","Seguimiento","Revise el estado de sus solicitudes.","solicitudes")}
      ${card("📂","Documentos","Consulte documentos y expedientes del condominio.","documentos")}
      ${card("🏛","Asambleas","Revise convocatorias, edictos y actas.","asambleas")}
    </section>
  `);
}

function card(icon,title,text,view){
  return `<button class="action-card" onclick="setView('${view}')">
    <div class="icon">${icon}</div>
    <h3>${title}</h3>
    <p>${text}</p>
    <span class="arrow">›</span>
  </button>`;
}

function documentos(){
  return shell(`
    <h2 class="page-title">📂 Archivo documental</h2>
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
      <div>
        <h3>${d.codigo} · ${d.titulo}</h3>
        <p>${d.fecha} · ${d.area} · ${d.exp}</p>
      </div>
      <div>${badge(d.estado)}</div>
    </article>
  `).join("") || "<p>No hay documentos.</p>";
}

function solicitudes(){
  return shell(`
    <h2 class="page-title">📋 Mis solicitudes</h2>
    <section class="panel">
      ${state.solicitudes.map(s=>`
        <div class="doc">
          <div>
            <h3>📄 ${s.asunto}</h3>
            <p><b>Tipo:</b> ${s.tipo}</p>
            <p><b>Prioridad:</b> ${s.prioridad}</p>
            <p><b>Responsable:</b> ${s.responsable}</p>
            <p><b>Fecha:</b> ${s.fecha}</p>
            <p><b>Estado:</b> ${s.estado}</p>
            <hr>
            <p>${s.desc}</p>
          </div>
          <div>${badge(s.estado)}</div>
        </div>
      `).join("")}
    </section>
  `);
}

function nuevo(){
  return shell(`
    <h2 class="page-title">📝 Nueva solicitud</h2>
    <section class="panel">
      <div class="form">
        <label>Tipo de solicitud</label>
        <select><option>Consulta</option><option>Avería</option><option>Queja</option><option>Sugerencia</option></select>
        <label>Prioridad</label>
        <select><option>Media</option><option>Baja</option><option>Alta</option><option>Urgente</option></select>
        <label>Asunto</label>
        <input placeholder="Ejemplo: Fuga de agua">
        <label>Descripción</label>
        <textarea placeholder="Describa detalladamente la situación..."></textarea>
        <label>Adjuntar fotografías</label>
        <input type="file" multiple accept="image/*">
        <button class="btn" onclick="alert('Solicitud registrada en modo diseño. Luego conectamos Google Sheets y Drive.')">Enviar solicitud</button>
        <button class="btn ghost" onclick="setView('inicio')">Cancelar</button>
      </div>
    </section>
  `);
}

function perfil(){
  return shell(`
    <h2 class="page-title">👤 Mi perfil</h2>
    <section class="panel profile-card">
      <div class="avatar">👤</div>
      <h2>${state.user.nombre}</h2>
      <p><b>🏠 Filial:</b> ${state.user.filial}</p>
      <p><b>✉ Correo:</b> ${state.user.correo}</p>
      <p><b>📞 Teléfono:</b> ${state.user.telefono}</p>
      <p><b>✅ Estado:</b> ${state.user.estado}</p>
    </section>
  `);
}

function asambleas(){
  return shell(`
    <h2 class="page-title">🏛 Asamblea Extraordinaria 2026</h2>
    <section class="panel">
      <h3>Cronología del expediente</h3>
      <div class="timeline">
        ${state.timeline.map(t=>`<div class="time-item"><div class="time-date">${t[0]}</div><div class="time-body">${t[1]}</div></div>`).join("")}
      </div>
    </section>
  `);
}

function admin(){
  return shell(`
    <h2 class="page-title">⚙ Panel administrativo</h2>
    <section class="grid three">
      <div class="stat"><span>Documentos</span><strong>${state.documentos.length}</strong></div>
      <div class="stat"><span>Expedientes</span><strong>2</strong></div>
      <div class="stat"><span>Solicitudes</span><strong>${state.solicitudes.length}</strong></div>
    </section>
    <section class="panel">
      <h3>Próxima fase</h3>
      <p>Conectar este diseño con Google Sheets para usuarios, documentos, solicitudes y expedientes.</p>
    </section>
  `);
}

function render(){
  const routes={inicio,documentos,solicitudes,nuevo,perfil,asambleas,admin};
  document.getElementById("app").innerHTML=(routes[state.view]||inicio)();
  if(state.view==="documentos") filterDocs();
}
render();
