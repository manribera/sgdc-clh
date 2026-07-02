const API_URL = ""; // Aquí pegaremos luego la URL /exec de Apps Script.

const state = {
  view: "inicio",
  admin: false,
  documentos: [
    {
      codigo: "JF-001-2026",
      fecha: "2026-06-03",
      titulo: "Solicitud de Convocatoria a Asamblea Extraordinaria",
      area: "Asambleas",
      expediente: "EXP-2026-002 Asamblea Extraordinaria 2026",
      tipo: "Oficio",
      estado: "Vigente",
      resumen: "Solicitud presentada por propietarios que representan el 37,24% del valor total del condominio.",
      link: "#"
    },
    {
      codigo: "ED-001-2026",
      fecha: "2026-06-30",
      titulo: "Edicto de Convocatoria a Asamblea Extraordinaria",
      area: "Asambleas",
      expediente: "EXP-2026-002 Asamblea Extraordinaria 2026",
      tipo: "Edicto",
      estado: "Publicado",
      resumen: "Edicto publicado en el Diario Oficial La Gaceta.",
      link: "#"
    },
    {
      codigo: "ADM-2026-001",
      fecha: "2026-05-25",
      titulo: "Plan de trabajo administrativo",
      area: "Administración",
      expediente: "EXP-2026-001 Fiscalización Administración MARMAT",
      tipo: "Comunicación",
      estado: "Vigente",
      resumen: "Plan de reuniones, reportes mensuales y lineamientos de comunicación.",
      link: "#"
    }
  ],
  expedientes: [
    {
      codigo: "EXP-2026-001",
      nombre: "Fiscalización Integral de la Administración MARMAT",
      area: "Administración",
      estado: "Abierto",
      descripcion: "Contratos, proveedores, finanzas, respuestas y seguimiento de la gestión administrativa."
    },
    {
      codigo: "EXP-2026-002",
      nombre: "Asamblea Extraordinaria 2026",
      area: "Asambleas",
      estado: "Abierto",
      descripcion: "Solicitud, seguimiento, edicto, convocatoria, comunicación a propietarios, asistencia y acta."
    }
  ],
  solicitudes: [
    {
      id: "SOL-0001",
      fecha: "2026-07-02",
      usuario: "Propietario ejemplo",
      tipo: "Consulta",
      prioridad: "Media",
      asunto: "Consulta sobre documentos",
      estado: "Pendiente"
    }
  ]
};

const menu = [
  ["inicio", "🏠", "Inicio"],
  ["documentos", "📂", "Documentos"],
  ["expedientes", "📑", "Expedientes"],
  ["solicitudes", "📝", "Solicitudes"],
  ["registrar", "➕", "Registrar"],
  ["admin", "🔐", "Admin"]
];

function $(id) {
  return document.getElementById(id);
}

function setView(view) {
  state.view = view;
  render();
}

function badge(value) {
  return `<span class="badge ${String(value || "").toLowerCase()}">${value || ""}</span>`;
}

function layout(content, title = "Sistema de Gestión Documental", subtitle = "Condominio Los Helechos") {
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <h1>SGDC-CLH</h1>
          <p>Sistema de Gestión Documental<br>Condominio Los Helechos</p>
        </div>
        <nav class="nav">
          ${menu.map(m => `
            <button class="${state.view === m[0] ? "active" : ""}" onclick="setView('${m[0]}')">
              ${m[1]} ${m[2]}
            </button>
          `).join("")}
        </nav>
      </aside>

      <main class="main">
        <div class="topbar">
          <div>
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          <button class="admin-access" onclick="setView('admin')">Acceso admin</button>
        </div>

        ${content}
      </main>

      <nav class="mobile-nav">
        ${menu.slice(0,4).map(m => `
          <button class="${state.view === m[0] ? "active" : ""}" onclick="setView('${m[0]}')">
            <strong>${m[1]}</strong>${m[2]}
          </button>
        `).join("")}
      </nav>
    </div>
  `;
}

function renderInicio() {
  return layout(`
    <div class="grid cols-3">
      <div class="card stat"><span>Documentos registrados</span><strong>${state.documentos.length}</strong></div>
      <div class="card stat"><span>Expedientes abiertos</span><strong>${state.expedientes.length}</strong></div>
      <div class="card stat"><span>Solicitudes registradas</span><strong>${state.solicitudes.length}</strong></div>
    </div>

    <div class="grid cols-2" style="margin-top:16px">
      <div class="card">
        <h3>Accesos rápidos</h3>
        <button class="btn" onclick="setView('documentos')">Buscar documentos</button>
        <button class="btn secondary" onclick="setView('expedientes')" style="margin-left:8px">Ver expedientes</button>
      </div>

      <div class="card">
        <h3>Objetivo del sistema</h3>
        <p>Centralizar documentos, expedientes, solicitudes y comunicaciones relevantes del Condominio Los Helechos en un portal fácil de consultar.</p>
      </div>
    </div>
  `, "Inicio", "Archivo documental y solicitudes");
}

function renderDocumentos() {
  return layout(`
    <div class="card">
      <h3>Buscar documentos</h3>
      <div class="toolbar">
        <input id="q" class="input" placeholder="Buscar por título, código, resumen..." oninput="filtrarDocumentos()" />
        <select id="area" onchange="filtrarDocumentos()">
          <option value="">Todas las áreas</option>
          <option>Asambleas</option>
          <option>Administración</option>
          <option>Finanzas</option>
          <option>Contratos</option>
          <option>Proyectos</option>
          <option>Junta Fiscalizadora</option>
        </select>
        <select id="tipo" onchange="filtrarDocumentos()">
          <option value="">Todos los tipos</option>
          <option>Oficio</option>
          <option>Convocatoria</option>
          <option>Edicto</option>
          <option>Contrato</option>
          <option>Acta</option>
          <option>Informe</option>
        </select>
        <button class="btn" onclick="filtrarDocumentos()">Filtrar</button>
      </div>
      <div id="tablaDocumentos"></div>
    </div>
  `, "Documentos", "Consulta y trazabilidad documental");
}

function filtrarDocumentos() {
  const q = ($("q")?.value || "").toLowerCase();
  const area = $("area")?.value || "";
  const tipo = $("tipo")?.value || "";

  const data = state.documentos.filter(d => {
    const texto = `${d.codigo} ${d.titulo} ${d.resumen} ${d.expediente}`.toLowerCase();
    return (!q || texto.includes(q)) &&
           (!area || d.area === area) &&
           (!tipo || d.tipo === tipo);
  });

  $("tablaDocumentos").innerHTML = tablaDocs(data);
}

function tablaDocs(data) {
  if (!data.length) return `<p>No hay documentos para mostrar.</p>`;

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Código</th><th>Fecha</th><th>Título</th><th>Área</th><th>Expediente</th><th>Estado</th><th>PDF</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(d => `
            <tr>
              <td><strong>${d.codigo}</strong></td>
              <td>${d.fecha}</td>
              <td>${d.titulo}<br><small>${d.resumen}</small></td>
              <td>${d.area}</td>
              <td>${d.expediente}</td>
              <td>${badge(d.estado)}</td>
              <td><a href="${d.link}" target="_blank">Ver</a></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderExpedientes() {
  return layout(`
    <div class="grid">
      ${state.expedientes.map(e => `
        <div class="card">
          <h3>${e.codigo} · ${e.nombre}</h3>
          <p>${e.descripcion}</p>
          <p><strong>Área:</strong> ${e.area} &nbsp; ${badge(e.estado)}</p>
        </div>
      `).join("")}
    </div>
  `, "Expedientes", "Organización por temas y procesos");
}

function renderSolicitudes() {
  return layout(`
    <div class="grid cols-2">
      <div class="card">
        <h3>Nueva solicitud</h3>
        <div class="form-grid">
          <input id="solNombre" class="input full" placeholder="Nombre del propietario" />
          <select id="solTipo">
            <option>Consulta</option><option>Queja</option><option>Avería</option><option>Sugerencia</option><option>Solicitud</option>
          </select>
          <select id="solPrioridad">
            <option>Baja</option><option>Media</option><option>Alta</option><option>Urgente</option>
          </select>
          <input id="solAsunto" class="input full" placeholder="Asunto" />
          <textarea id="solDesc" class="full" placeholder="Descripción"></textarea>
          <button class="btn green full" onclick="crearSolicitud()">Registrar solicitud</button>
        </div>
      </div>

      <div class="card">
        <h3>Solicitudes recientes</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Asunto</th><th>Prioridad</th><th>Estado</th></tr></thead>
            <tbody>
              ${state.solicitudes.map(s => `
                <tr><td>${s.id}</td><td>${s.asunto}<br><small>${s.usuario}</small></td><td>${s.prioridad}</td><td>${badge(s.estado)}</td></tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `, "Solicitudes", "Consultas, reportes y seguimiento");
}

function crearSolicitud() {
  const nombre = $("solNombre").value.trim();
  const asunto = $("solAsunto").value.trim();

  if (!nombre || !asunto) {
    alert("Completá el nombre y el asunto.");
    return;
  }

  state.solicitudes.unshift({
    id: "SOL-" + String(state.solicitudes.length + 1).padStart(4, "0"),
    fecha: new Date().toISOString().slice(0,10),
    usuario: nombre,
    tipo: $("solTipo").value,
    prioridad: $("solPrioridad").value,
    asunto,
    estado: "Pendiente"
  });

  alert("Solicitud registrada en modo local. Luego la conectamos a Google Sheets.");
  setView("solicitudes");
}

function renderRegistrar() {
  return layout(`
    <div class="card">
      <h3>Registrar documento</h3>
      <p class="notice">Esta versión registra en modo local de prueba. En la siguiente fase conectamos este formulario a Google Sheets.</p>

      <div class="form-grid">
        <input id="docCodigo" class="input" placeholder="Código, ejemplo ED-001-2026" />
        <input id="docFecha" class="input" type="date" />
        <input id="docTitulo" class="input full" placeholder="Título del documento" />
        <select id="docArea">
          <option>Asambleas</option><option>Administración</option><option>Finanzas</option><option>Contratos</option><option>Proyectos</option><option>Junta Fiscalizadora</option>
        </select>
        <select id="docTipo">
          <option>Oficio</option><option>Convocatoria</option><option>Edicto</option><option>Contrato</option><option>Acta</option><option>Informe</option>
        </select>
        <input id="docExp" class="input full" placeholder="Expediente" />
        <input id="docLink" class="input full" placeholder="Enlace al PDF en Drive, SharePoint o GitHub" />
        <textarea id="docResumen" class="full" placeholder="Resumen breve"></textarea>
        <button class="btn green full" onclick="registrarDocumentoLocal()">Guardar documento</button>
      </div>
    </div>
  `, "Registrar", "Nuevo documento o expediente");
}

function registrarDocumentoLocal() {
  const codigo = $("docCodigo").value.trim();
  const titulo = $("docTitulo").value.trim();

  if (!codigo || !titulo) {
    alert("Completá código y título.");
    return;
  }

  state.documentos.unshift({
    codigo,
    fecha: $("docFecha").value,
    titulo,
    area: $("docArea").value,
    expediente: $("docExp").value,
    tipo: $("docTipo").value,
    estado: "Vigente",
    resumen: $("docResumen").value,
    link: $("docLink").value || "#"
  });

  alert("Documento agregado en modo local. Luego lo guardaremos en Google Sheets.");
  setView("documentos");
  setTimeout(filtrarDocumentos, 0);
}

function renderAdmin() {
  if (!state.admin) {
    return layout(`
      <div class="card login-box">
        <h3>Acceso administrativo</h3>
        <p>Ingreso temporal para pruebas.</p>
        <input id="adminUser" class="input" placeholder="Usuario" style="margin-bottom:10px" />
        <input id="adminPass" class="input" type="password" placeholder="Clave" style="margin-bottom:10px" />
        <button class="btn" onclick="loginAdmin()">Ingresar</button>
      </div>
    `, "Admin", "Panel administrativo");
  }

  return layout(`
    <div class="grid cols-3">
      <div class="card stat"><span>Documentos</span><strong>${state.documentos.length}</strong></div>
      <div class="card stat"><span>Expedientes</span><strong>${state.expedientes.length}</strong></div>
      <div class="card stat"><span>Solicitudes</span><strong>${state.solicitudes.length}</strong></div>
    </div>

    <div class="card" style="margin-top:16px">
      <h3>Panel administrativo</h3>
      <p>Desde aquí luego aprobaremos usuarios, modificaremos solicitudes, registraremos documentos y conectaremos Google Sheets.</p>
      <button class="btn secondary" onclick="state.admin=false; setView('inicio')">Cerrar sesión</button>
    </div>
  `, "Admin", "Control interno");
}

function loginAdmin() {
  const user = $("adminUser").value.trim();
  const pass = $("adminPass").value.trim();

  if (user === "admin" && pass === "1234") {
    state.admin = true;
    setView("admin");
  } else {
    alert("Usuario o clave incorrectos. Prueba: admin / 1234");
  }
}

function render() {
  const routes = {
    inicio: renderInicio,
    documentos: renderDocumentos,
    expedientes: renderExpedientes,
    solicitudes: renderSolicitudes,
    registrar: renderRegistrar,
    admin: renderAdmin
  };

  document.getElementById("app").innerHTML = (routes[state.view] || renderInicio)();

  if (state.view === "documentos") {
    filtrarDocumentos();
  }
}

render();
