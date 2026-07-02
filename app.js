const ICONS = {
  home:`<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>`,
  file:`<svg viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h6"/></svg>`,
  folder:`<svg viewBox="0 0 24 24"><path d="M3 6h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
  clip:`<svg viewBox="0 0 24 24"><path d="M9 4h6"/><path d="M9 20h6"/><rect x="7" y="4" width="10" height="16" rx="2"/><path d="M10 9h4M10 13h4M10 17h2"/></svg>`,
  msg:`<svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>`,
  calendar:`<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>`,
  user:`<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
  bank:`<svg viewBox="0 0 24 24"><path d="M3 10h18L12 4z"/><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 18h18M2 21h20"/></svg>`
};

const state = {
  view: "inicio",
  logged: false,
  currentUser: null,
  usuarios: [
    { id:"USR-001", nombre:"Administrador", apellidos:"", cedula:"", telefono:"", correo:"admin@clh.local", filial:"Administración", clave:"1234", rol:"ADMIN", estado:"ACTIVO" },
    { id:"USR-002", nombre:"Usuario", apellidos:"Pendiente", cedula:"", telefono:"", correo:"pendiente@clh.local", filial:"Pendiente", clave:"1234", rol:"PROPIETARIO", estado:"PENDIENTE" }
  ],
  documentos: [
    {codigo:"JF-001-2026",fecha:"03/06/2026",titulo:"Solicitud de Convocatoria a Asamblea Extraordinaria",area:"Asambleas",exp:"EXP-2026-002",estado:"Vigente"},
    {codigo:"ED-001-2026",fecha:"30/06/2026",titulo:"Edicto de Convocatoria en La Gaceta",area:"Asambleas",exp:"EXP-2026-002",estado:"Publicado"},
    {codigo:"ADM-001-2026",fecha:"25/05/2026",titulo:"Plan de trabajo administrativo",area:"Administración",exp:"EXP-2026-001",estado:"Vigente"},
    {codigo:"JF-ACC-2026",fecha:"22/06/2026",titulo:"Solicitud de información sobre obras del sistema de acceso",area:"Proyectos",exp:"EXP-2026-001",estado:"Vigente"}
  ],
  solicitudes: []
};

const nav = [
  ["inicio", ICONS.home, "Inicio"],
  ["documentos", ICONS.folder, "Documentos"],
  ["nuevo", "plus", ""],
  ["solicitudes", ICONS.clip, "Solicitudes"],
  ["perfil", ICONS.user, "Perfil"]
];

function setView(v) {
  state.view = v;
  render();
}

function badge(t, cls="") {
  return `<span class="badge ${cls}">${t}</span>`;
}

function shell(content) {
  return `<div class="app"><div class="shell">
    <button class="admin-pill" onclick="setView('admin')">Admin</button>
    <div class="content">${content}</div>
    <nav class="bottom-nav">
      ${nav.map(n => n[1] === "plus"
        ? `<button class="plus" onclick="setView('nuevo')" title="Nueva solicitud"></button>`
        : `<button class="${state.view===n[0]?'active':''}" onclick="setView('${n[0]}')">${n[1]}${n[2]}</button>`
      ).join("")}
    </nav>
  </div></div>`;
}

function title(icon, text) {
  return `<h2 class="page-title">${icon}${text}</h2>`;
}

function homeCard(icon, title, text, view) {
  return `<button class="card-btn" onclick="setView('${view}')">
    <div class="icon-circle">${icon}</div>
    <h3>${title}</h3>
    <p>${text}</p>
    <span class="go">›</span>
  </button>`;
}

function inicio() {
  const bienvenida = state.logged && state.currentUser
    ? `Bienvenido, ${state.currentUser.nombre}`
    : "Bienvenido";

  return shell(`
    <section class="hero">
      <div>
        <h1>Condominio<br>Los Helechos</h1>
        <p>${bienvenida}</p>
      </div>
    </section>

    <section class="home-grid">
      ${homeCard(ICONS.file, "Documentos", "Consulte documentos y expedientes del condominio.", "documentos")}
      ${homeCard(ICONS.bank, "Asambleas", "Convocatorias, edictos, actas y acuerdos.", "asambleas")}
      ${homeCard(ICONS.msg, "Comunicados", "Circulares, avisos e información general.", "comunicados")}
      ${homeCard(ICONS.calendar, "Casa Club", "Agenda y reserva de la Casa Club.", "casaclub")}
      ${homeCard(ICONS.clip, "Solicitudes", "Reporte averías, consultas, quejas o sugerencias.", "nuevo")}
      ${homeCard(ICONS.user, "Mi perfil", "Ingreso, registro y datos del usuario.", "perfil")}
    </section>
  `);
}

function documentos() {
  return shell(`
    ${title(ICONS.folder, "Archivo documental")}
    <section class="panel">
      <div class="searchbar">
        <input id="q" placeholder="Buscar por MARMAT, Asamblea, contrato, fecha..." oninput="filterDocs()">
        <select id="area" onchange="filterDocs()">
          <option value="">Todas las áreas</option>
          <option>Asambleas</option>
          <option>Administración</option>
          <option>Proyectos</option>
        </select>
        <select id="estado" onchange="filterDocs()">
          <option value="">Todos los estados</option>
          <option>Vigente</option>
          <option>Publicado</option>
        </select>
      </div>
      <div id="docList" class="doc-list"></div>
    </section>
  `);
}

function filterDocs() {
  const q = (document.getElementById("q")?.value || "").toLowerCase();
  const area = document.getElementById("area")?.value || "";
  const estado = document.getElementById("estado")?.value || "";

  const docs = state.documentos.filter(d => {
    const txt = `${d.codigo} ${d.fecha} ${d.titulo} ${d.area} ${d.exp}`.toLowerCase();
    return (!q || txt.includes(q)) && (!area || d.area === area) && (!estado || d.estado === estado);
  });

  document.getElementById("docList").innerHTML = docs.map(d => `
    <article class="doc">
      <div>
        <h3>${d.codigo} · ${d.titulo}</h3>
        <p>${d.fecha} · ${d.area} · ${d.exp}</p>
      </div>
      <div>${badge(d.estado)}</div>
    </article>
  `).join("") || "<p>No hay documentos.</p>";
}

function asambleas() {
  return shell(`
    ${title(ICONS.bank, "Asambleas")}
    <section class="panel">
      <div class="modules">
        <div class="module-card"><h3>Convocatorias</h3><ul><li>Ordinarias</li><li>Extraordinarias</li></ul></div>
        <div class="module-card"><h3>Edictos</h3><ul><li>Publicaciones oficiales</li><li>Respaldo de publicación</li></ul></div>
        <div class="module-card"><h3>Actas</h3><ul><li>Actas aprobadas</li><li>Actas pendientes</li></ul></div>
        <div class="module-card"><h3>Documentación de Asamblea</h3><ul><li>Orden del día</li><li>Poderes</li><li>Lista de asistencia</li><li>Acuerdos</li></ul></div>
      </div>
    </section>
  `);
}

function comunicados() {
  return shell(`
    ${title(ICONS.msg, "Comunicados")}
    <section class="panel">
      <div class="modules">
        <div class="module-card"><h3>Circulares</h3><ul><li>Información general</li><li>Recordatorios</li></ul></div>
        <div class="module-card"><h3>Avisos</h3><ul><li>Mantenimiento</li><li>Emergencias</li><li>Horarios</li></ul></div>
        <div class="module-card"><h3>Boletines</h3><ul><li>Noticias</li><li>Actividades comunitarias</li></ul></div>
        <div class="module-card"><h3>Información a propietarios</h3><ul><li>Comunicaciones informativas</li><li>Documentos de interés común</li></ul></div>
      </div>
    </section>
  `);
}

function casaclub() {
  return shell(`
    ${title(ICONS.calendar, "Casa Club - Reservas")}
    <section class="panel calendar-wrap">
      <div>
        <h3>Mayo 2026</h3>
        <div class="calendar">
          ${["Do","Lu","Ma","Mi","Ju","Vi","Sá"].map(d=>`<b>${d}</b>`).join("")}
          ${["26","27","28","29","30"].map(d=>`<span class="day muted">${d}</span>`).join("")}
          ${Array.from({length:31},(_,i)=>i+1).map(d=>`<span class="day ${d===31?'active':''} ${[7,14,22,26].includes(d)?'dot':''}">${d}</span>`).join("")}
        </div>
      </div>
      <div>
        <h3>Sábado, 31 de mayo de 2026</h3>
        <div class="slots">
          <div class="slot"><span>8:00 a. m. – 12:00 m.</span><b>Disponible</b></div>
          <div class="slot"><span>12:00 m. – 4:00 p. m.</span><b>Disponible</b></div>
          <div class="slot"><span>4:00 p. m. – 8:00 p. m.</span><b>Disponible</b></div>
          <div class="slot selected"><span>2:00 p. m. – 6:00 p. m.</span><b>Seleccionado</b></div>
        </div>
      </div>
      <div>
        <h3>Casa Club</h3>
        <p>Capacidad máxima: 60 personas.</p>
        <p>Incluye salón, cocina, baños y área de parqueo.</p>
        <button class="btn">Reservar</button>
        <br><br>
        <button class="btn ghost">Ver mis reservas</button>
      </div>
    </section>
  `);
}

function nuevo() {
  if (!state.logged) {
    return shell(`
      ${title(ICONS.user, "Ingreso requerido")}
      <section class="panel">
        <p>Para enviar una solicitud debe iniciar sesión o registrarse.</p>
        <button class="btn" onclick="setView('perfil')">Ingresar</button>
        <button class="btn ghost" onclick="setView('registro')">Registrarme</button>
      </section>
    `);
  }

  return shell(`
    ${title(ICONS.file, "Nueva solicitud")}
    <section class="panel">
      <div class="form">
        <label>Tipo de solicitud</label>
        <select id="tipo"><option>Consulta</option><option>Avería</option><option>Queja</option><option>Sugerencia</option></select>
        <label>Prioridad</label>
        <select id="prioridad"><option>Media</option><option>Baja</option><option>Alta</option><option>Urgente</option></select>
        <label>Asunto</label>
        <input id="asunto" placeholder="Ejemplo: Fuga de agua">
        <label>Descripción</label>
        <textarea id="descripcion" placeholder="Describa detalladamente la situación..."></textarea>
        <label>Adjuntar fotografías</label>
        <input type="file" multiple accept="image/*">
        <button class="btn" onclick="guardarSolicitud()">Enviar solicitud</button>
        <button class="btn ghost" onclick="setView('inicio')">Cancelar</button>
      </div>
    </section>
  `);
}

function guardarSolicitud() {
  const asunto = document.getElementById("asunto").value.trim();
  if (!asunto) {
    alert("Debe indicar el asunto.");
    return;
  }

  state.solicitudes.unshift({
    asunto,
    tipo: document.getElementById("tipo").value,
    prioridad: document.getElementById("prioridad").value,
    responsable: "Pendiente de asignación",
    fecha: new Date().toLocaleString("es-CR"),
    estado: "Pendiente",
    desc: document.getElementById("descripcion").value
  });

  alert("Solicitud registrada correctamente.");
  setView("solicitudes");
}

function solicitudes() {
  if (!state.logged) {
    return shell(`
      ${title(ICONS.clip, "Mis solicitudes")}
      <section class="panel">
        <p>Debe iniciar sesión para ver sus solicitudes.</p>
        <button class="btn" onclick="setView('perfil')">Ingresar</button>
      </section>
    `);
  }

  return shell(`
    ${title(ICONS.clip, "Mis solicitudes")}
    <section class="panel">
      ${state.solicitudes.length ? state.solicitudes.map(s => `
        <div class="doc">
          <div>
            <h3>${s.asunto}</h3>
            <p><b>Tipo:</b> ${s.tipo}</p>
            <p><b>Prioridad:</b> ${s.prioridad}</p>
            <p><b>Responsable:</b> ${s.responsable}</p>
            <p><b>Fecha:</b> ${s.fecha}</p>
            <p><b>Estado:</b> ${s.estado}</p>
            <hr>
            <p>${s.desc || ""}</p>
          </div>
          <div>${badge(s.estado, s.estado === "Pendiente" ? "pending" : "")}</div>
        </div>
      `).join("") : "<p>No tiene solicitudes registradas.</p>"}
    </section>
  `);
}

function perfil() {
  if (!state.logged) {
    return shell(`
      ${title(ICONS.user, "Ingreso de usuario")}
      <section class="panel">
        <div class="form">
          <label>Correo electrónico</label>
          <input id="correoLogin" placeholder="correo@ejemplo.com">
          <label>Contraseña</label>
          <input id="claveLogin" type="password" placeholder="Contraseña">
          <button class="btn" onclick="login()">Ingresar</button>
          <button class="btn ghost" onclick="setView('registro')">Registrarme</button>
        </div>
      </section>
    `);
  }

  return shell(`
    ${title(ICONS.user, "Mi perfil")}
    <section class="panel profile-card">
      <div class="avatar">${ICONS.user}</div>
      <h2>${state.currentUser.nombre} ${state.currentUser.apellidos || ""}</h2>
      <p><b>Filial:</b> ${state.currentUser.filial}</p>
      <p><b>Correo:</b> ${state.currentUser.correo}</p>
      <p><b>Teléfono:</b> ${state.currentUser.telefono || "No registrado"}</p>
      <p><b>Estado:</b> ${state.currentUser.estado}</p>
      <button class="btn ghost" onclick="logout()">Cerrar sesión</button>
    </section>
  `);
}

function login() {
  const correo = document.getElementById("correoLogin").value.trim().toLowerCase();
  const clave = document.getElementById("claveLogin").value.trim();

  const user = state.usuarios.find(u => u.correo.toLowerCase() === correo && u.clave === clave);

  if (!user) {
    alert("Usuario o contraseña incorrectos.");
    return;
  }

  if (user.estado !== "ACTIVO") {
    alert("Su usuario está pendiente de aprobación.");
    return;
  }

  state.logged = true;
  state.currentUser = user;
  setView("inicio");
}

function logout() {
  state.logged = false;
  state.currentUser = null;
  setView("inicio");
}

function registro() {
  return shell(`
    ${title(ICONS.user, "Registro de usuario")}
    <section class="panel">
      <div class="form two">
        <div><label>Nombre</label><input id="regNombre" placeholder="Nombre"></div>
        <div><label>Apellidos</label><input id="regApellidos" placeholder="Apellidos"></div>
        <div><label>Cédula</label><input id="regCedula" placeholder="Cédula"></div>
        <div><label>Teléfono</label><input id="regTelefono" placeholder="Teléfono"></div>
        <div class="full"><label>Correo</label><input id="regCorreo" placeholder="Correo electrónico"></div>
        <div><label>Finca / Filial</label><input id="regFilial" placeholder="Ejemplo: Casa 10"></div>
        <div><label>Contraseña</label><input id="regClave" type="password" placeholder="Contraseña"></div>
        <button class="btn full" onclick="registrarUsuario()">Enviar registro</button>
      </div>
    </section>
  `);
}

function registrarUsuario() {
  const nombre = document.getElementById("regNombre").value.trim();
  const correo = document.getElementById("regCorreo").value.trim();

  if (!nombre || !correo) {
    alert("Nombre y correo son obligatorios.");
    return;
  }

  state.usuarios.push({
    id: "USR-" + String(state.usuarios.length + 1).padStart(3, "0"),
    nombre,
    apellidos: document.getElementById("regApellidos").value.trim(),
    cedula: document.getElementById("regCedula").value.trim(),
    telefono: document.getElementById("regTelefono").value.trim(),
    correo,
    filial: document.getElementById("regFilial").value.trim(),
    clave: document.getElementById("regClave").value.trim(),
    rol: "PROPIETARIO",
    estado: "PENDIENTE"
  });

  alert("Registro recibido. Queda pendiente de aprobación del administrador.");
  setView("perfil");
}

function admin() {
  const pendientes = state.usuarios.filter(u => u.estado === "PENDIENTE");
  const activos = state.usuarios.filter(u => u.estado === "ACTIVO");

  return shell(`
    ${title(ICONS.user, "Administración")}
    <section class="admin-grid">
      <div class="stat"><span>Usuarios activos</span><strong>${activos.length}</strong></div>
      <div class="stat"><span>Usuarios pendientes</span><strong>${pendientes.length}</strong></div>
      <div class="stat"><span>Solicitudes</span><strong>${state.solicitudes.length}</strong></div>
    </section>
    <br>
    <section class="panel">
      <h3>Usuarios pendientes</h3>
      ${pendientes.length ? pendientes.map(u => `
        <div class="doc">
          <div>
            <h3>${u.nombre} ${u.apellidos}</h3>
            <p>${u.correo} · ${u.filial || "Sin filial"}</p>
          </div>
          <div>
            <button class="btn" onclick="aprobarUsuario('${u.id}')">Aprobar</button>
          </div>
        </div>
      `).join("") : "<p>No hay usuarios pendientes.</p>"}
    </section>
  `);
}

function aprobarUsuario(id) {
  const user = state.usuarios.find(u => u.id === id);
  if (user) user.estado = "ACTIVO";
  alert("Usuario aprobado.");
  setView("admin");
}

function render() {
  const routes = {inicio, documentos, solicitudes, nuevo, perfil, asambleas, comunicados, casaclub, registro, admin};
  document.getElementById("app").innerHTML = (routes[state.view] || inicio)();
  if (state.view === "documentos") filterDocs();
}

render();
