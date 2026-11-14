/* Página de oferta del Explicador (Reyes Connect Inc.).
   Lo único que sale del teléfono es el pedido del cierre (nombre, negocio, teléfono, la opción y el permiso P2),
   solo si la persona lo envía y solo a un punto de entrada propio de la oferta (config.js: registroApi).
   Nada se da por hecho a ciegas: «Anotamos tu pedido» o el pago salen solo si ese punto contesta { ok:true, id }.
   El cupo sale de una sola fuente (config.js: cupoApi, la tabla que lee Muse). Sin analítica ni cookies. */
(function () {
  "use strict";
  var C = window.RC_OFERTA_CONFIG || {};
  var lang = document.documentElement.lang === "en" ? "en" : "es";
  var $ = function (s) { return document.querySelector(s); };
  var TEL = C.telefono || "+1 786-835-2214";
  var TEL_CORTO = TEL.replace(/^\+1\s*/, "");
  var WA = !!C.whatsappEmpresa;

  /* Permiso P2, versión negocio-contacto-v1-2026-11-13 (CIERRE-POR-PALABRA.md). Texto exacto; si cambia, sube la versión. */
  var PERMISO = {
    version: "negocio-contacto-v1-2026-11-13",
    entidad: "Reyes Connect Inc.",
    es: "Autorizo a Reyes Connect Inc. a escribirme por WhatsApp y a llamarme al número que doy sobre lo que escogí en esta página. Me escribe el equipo de Reyes Connect y me llama una persona, nunca una voz automática. Pueden aplicar tarifas de mensajes y datos. No es condición de compra. Puedo responder NO o BAJA en cualquier momento y no me escriben más.",
    en: "I authorize Reyes Connect Inc. to message me on WhatsApp and call me at the number I give about what I chose on this page. The Reyes Connect team writes to me and a person calls me, never an automated voice. Message and data rates may apply. This is not a condition of purchase. I can reply NO or STOP at any time and they won't write to me again."
  };

  var MESES = {
    es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };
  var OPC = {
    unico: { es: "Explicador único", en: "Single explainer", precio: "US$297" },
    serie: { es: "Serie de 3", en: "Series of 3", precio: "US$597" },
    mensual: { es: "Explicador mensual", en: "Monthly explainer", precio: "US$497" },
    guion: { es: "Ver mi tema en un guion antes de decidir", en: "See my topic as a script before deciding", precio: "" }
  };
  var T = {
    es: {
      semanaDe: function (f) { return "la semana del lunes " + f.getDate() + " de " + MESES.es[f.getMonth()]; },
      quedan: function (q, n, s) { return "Para " + s + " quedan " + q + " de " + n + " lugares."; },
      llena: function (s, s2) { return "Ya se llenó " + s + ". El siguiente lugar es " + s2 + "."; },
      generico: "Producimos 3 explicadores por semana. Si la semana se llena, te damos la fecha del siguiente lugar.",
      porQue: "Son pocos porque cada video lo revisa una persona antes de que lo veas.",
      mensualLleno: "Hoy no hay lugar: tenemos 2 mensuales a la vez. Escoge otra opción.",
      guionLleno: "Esta semana ya hicimos los 2 guiones de muestra. Escoge otra opción o vuelve el lunes.",
      pagar: function (p) { return "Pagar " + p + " y empezar"; },
      pedir: WA ? "Pedir que me escriban" : "Pedir que me llamen",
      guionBtn: "Pedir mi guion de muestra",
      escogePrimero: "Escoge una opción arriba.",
      legalPago: "Al pagar aceptas los términos.",
      legalSinPago: "En este paso no cobramos nada.",
      llamarCon: function (o) { return "Llamar y pedir: " + o; },
      llamar: "Llamar al " + TEL_CORTO,
      pagarDirecto: function (p) { return "Pagar " + p + " con tarjeta"; },
      llamarAntes: "Prefiero hablar antes: " + TEL_CORTO,
      sinRegistroPago: function (o) {
        return "Pagas «" + o + "» con tarjeta en Stripe, a nombre de Reyes Connect Inc. Allí te pedimos el nombre de tu negocio y un teléfono. En un día hábil te llamamos desde el " + TEL + " para mandarte el formulario de 10 minutos. Si la semana ya está llena, te damos la fecha del siguiente lugar; si no te sirve, te devolvemos todo. ¿Prefieres hablar antes? Llámanos de lunes a sábado, de 9 a. m. a 6 p. m.";
      },
      sinRegistro: function (o) {
        return "Para pedir " + (o ? "«" + o + "»" : "tu opción") + ", llámanos al " + TEL + ", de lunes a sábado, de 9 a. m. a 6 p. m. Te contesta una persona. No cobramos nada por teléfono; el pago siempre es por un enlace de Stripe a nombre de Reyes Connect Inc.";
      },
      errNombre: "Escribe tu nombre.",
      errNegocio: "Escribe el nombre de tu negocio o agencia.",
      errTel: "Revisa el teléfono: van 10 números.",
      errPermiso: "Para seguir, marca la casilla de permiso.",
      errOpcion: "Escoge una opción.",
      enviando: "Enviando…",
      noEnvio: "No se pudo guardar tu pedido; todavía no está anotado. Vuelve a tocar el botón o llámanos al " + TEL + ".",
      alPago: "Pedido anotado. Te llevamos al pago seguro de Stripe…",
      okTit: "Anotamos tu pedido",
      okReserva: function (o, s) {
        return "Anotamos: " + o + (s ? ", para " + s : "") + ". No cobramos ahora. " +
          (WA ? "Te escribimos por WhatsApp con el enlace de pago" : "Te llamamos desde el " + TEL + " para confirmarlo y te mandamos el enlace de pago") +
          ", de lunes a sábado de 9 a. m. a 6 p. m., en un día hábil como máximo. El lugar queda tuyo cuando pagas.";
      },
      okGuion: "Anotamos que quieres ver tu tema en un guion antes de decidir. " +
        (WA ? "Te escribimos por WhatsApp" : "Te llamamos desde el " + TEL) +
        " para pedirte el tema en una frase. Lázaro revisa cada tema y te dice si lo hacemos; no todos se aceptan. No pagas nada.",
      okId: function (id) { return "Número de pedido: " + id + "."; },
      okPie: "Si cambias de idea, responde NO o BAJA y no te contactamos más.",
      sonidoOn: "Oír el video",
      sonidoOff: "Quitar el sonido"
    },
    en: {
      semanaDe: function (f) { return "the week of Monday, " + MESES.en[f.getMonth()] + " " + f.getDate(); },
      quedan: function (q, n, s) { return "For " + s + ", " + q + " of " + n + " spots are left."; },
      llena: function (s, s2) { return s.charAt(0).toUpperCase() + s.slice(1) + " is full. The next spot is " + s2 + "."; },
      generico: "We produce 3 explainers a week. If the week fills up, we give you the date of the next spot.",
      porQue: "There are few because a person reviews every video before you see it.",
      mensualLleno: "No spot today: we run 2 monthly clients at a time. Choose another option.",
      guionLleno: "We already wrote this week's 2 sample scripts. Choose another option or come back Monday.",
      pagar: function (p) { return "Pay " + p + " and start"; },
      pedir: WA ? "Ask them to message me" : "Ask for a call",
      guionBtn: "Ask for my sample script",
      escogePrimero: "Choose an option above.",
      legalPago: "By paying you accept the terms.",
      legalSinPago: "Nothing is charged in this step.",
      llamarCon: function (o) { return "Call and ask for: " + o; },
      llamar: "Call " + TEL_CORTO,
      pagarDirecto: function (p) { return "Pay " + p + " by card"; },
      llamarAntes: "I'd rather talk first: " + TEL_CORTO,
      sinRegistroPago: function (o) {
        return "You pay for “" + o + "” by card on Stripe, in the name of Reyes Connect Inc. There we ask for your business name and a phone number. Within one business day we call you from " + TEL + " to send you the 10-minute form. If the week is already full, we give you the date of the next spot; if it doesn't work for you, we refund everything. Rather talk first? Call us Monday to Saturday, 9 a.m. to 6 p.m.";
      },
      sinRegistro: function (o) {
        return "To ask for " + (o ? "“" + o + "”" : "your option") + ", call us at " + TEL + ", Monday to Saturday, 9 a.m. to 6 p.m. A person answers. We don't charge anything by phone; payment is always through a Stripe link in the name of Reyes Connect Inc.";
      },
      errNombre: "Write your name.",
      errNegocio: "Write the name of your business or agency.",
      errTel: "Check the phone: it takes 10 digits.",
      errPermiso: "To continue, check the permission box.",
      errOpcion: "Choose an option.",
      enviando: "Sending…",
      noEnvio: "Your request couldn't be saved; it is not noted yet. Tap the button again or call us at " + TEL + ".",
      alPago: "Request noted. Taking you to Stripe's secure checkout…",
      okTit: "We noted your request",
      okReserva: function (o, s) {
        return "Noted: " + o + (s ? ", for " + s : "") + ". We don't charge now. " +
          (WA ? "We'll message you on WhatsApp with the payment link" : "We'll call you from " + TEL + " to confirm it and send you the payment link") +
          ", Monday to Saturday, 9 a.m. to 6 p.m., within one business day. The spot is yours when you pay.";
      },
      okGuion: "Noted: you want to see your topic as a script before deciding. " +
        (WA ? "We'll message you on WhatsApp" : "We'll call you from " + TEL) +
        " to ask for your topic in one sentence. Lázaro reviews every topic and tells you whether we take it; not all are accepted. You pay nothing.",
      okId: function (id) { return "Request number: " + id + "."; },
      okPie: "If you change your mind, reply NO or STOP and we won't contact you again.",
      sonidoOn: "Hear the video",
      sonidoOff: "Mute"
    }
  }[lang];

  /* ---------- Video de muestra: sin sonido al cargar, botón para oírlo ---------- */
  var video = $("#muestra"), bSonido = $("#sonido");
  if (video && C.video) {
    var quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    video.muted = true;
    video.src = C.video;
    if (!quieto) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
    var pintarSonido = function () {
      bSonido.querySelector("span").textContent = video.muted || video.paused ? T.sonidoOn : T.sonidoOff;
      bSonido.setAttribute("aria-pressed", video.muted || video.paused ? "false" : "true");
    };
    bSonido.addEventListener("click", function () {
      if (video.muted || video.paused) {
        video.muted = false;
        if (video.paused) { try { video.currentTime = 0; } catch (e) {} }
        var q = video.play(); if (q && q.catch) q.catch(function () {});
      } else { video.muted = true; }
      pintarSonido();
    });
    video.addEventListener("click", function () { if (video.paused) video.play(); else video.pause(); pintarSonido(); });
    pintarSonido();
  }

  /* ---------- Cupo: una sola fuente, en vivo (config.js: cupoApi) ---------- */
  function deFecha(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ""); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function mas(d, dias) { var x = new Date(d.getTime()); x.setDate(x.getDate() + dias); return x; }
  function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function num(x) { return typeof x === "number" && isFinite(x) && x >= 0 ? x : null; }
  var cupo = { vivo: false, semanaPedido: null };
  function pintarCupo(texto) {
    document.querySelectorAll("[data-cupo]").forEach(function (el) { el.textContent = texto; });
    document.querySelectorAll("[data-cupo-porque]").forEach(function (el) { el.textContent = T.porQue; });
  }
  function apagarOpcion(valor, aviso) {
    var r = $('input[name="opcion"][value="' + valor + '"]');
    if (!r || r.disabled) return;
    if (r.checked) r.checked = false;
    r.disabled = true;
    var tarj = r.closest(".opcion");
    tarj.classList.add("apagada");
    var s = document.createElement("span"); s.className = "opcion-aviso"; s.textContent = aviso;
    tarj.querySelector(".opcion-cuerpo").appendChild(s);
  }
  pintarCupo(T.generico);
  function leerCupo() {
    if (!C.cupoApi) return;
    var hecho = false, ctrl = null;
    try { ctrl = new AbortController(); } catch (e) {}
    var reloj = setTimeout(function () { if (!hecho) { hecho = true; try { ctrl && ctrl.abort(); } catch (e) {} } }, 6000);
    fetch(C.cupoApi, { cache: "no-store", credentials: "omit", signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
      .then(function (j) {
        if (hecho) return; hecho = true; clearTimeout(reloj);
        var lunes = deFecha(j && j.semana), lugares = num(j && j.lugares), tomados = num(j && j.tomados);
        var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
        // Se usa solo si dice ok, trae los números y la semana no ha terminado (su viernes).
        if (!j || j.ok !== true || !lunes || lugares === null || tomados === null || hoy > mas(lunes, 4)) return;
        var quedan = Math.max(0, lugares - tomados);
        cupo.vivo = true;
        if (quedan > 0) { cupo.semanaPedido = lunes; pintarCupo(T.quedan(quedan, lugares, T.semanaDe(lunes))); }
        else { cupo.semanaPedido = mas(lunes, 7); pintarCupo(T.llena(T.semanaDe(lunes), T.semanaDe(cupo.semanaPedido))); }
        var mens = num(j.mensuales_activos), guiones = num(j.guiones_semana);
        if (mens !== null && mens >= (+C.mensualesMax || 2)) apagarOpcion("mensual", T.mensualLleno);
        if (guiones !== null && guiones >= (+C.guionesMax || 2)) apagarOpcion("guion", T.guionLleno);
        pintarBoton();
      })
      .catch(function () { if (!hecho) { hecho = true; clearTimeout(reloj); } });
  }

  /* ---------- Cierre: escoger, dejar datos y permiso ---------- */
  var conRegistro = !!C.registroApi;
  // Un enlace de pago solo se usa con registro (el pedido queda anotado antes de pagar) y con el cupo en vivo.
  function enlaceDe(op) {
    var u = C.enlaces && C.enlaces[op];
    if (!conRegistro || !cupo.vivo) return null;
    return (u && /^https:\/\//.test(u) && u.indexOf("{") < 0) ? u : null;
  }
  // Sin registro (hoy en producción): el único y la serie se pagan directo; Stripe guarda el negocio y el teléfono.
  function enlaceDirecto(op) {
    if (op !== "unico" && op !== "serie") return null;
    var u = C.enlaces && C.enlaces[op];
    return (u && /^https:\/\//.test(u) && u.indexOf("{") < 0) ? u : null;
  }
  var form = $("#form-cierre"), boton = $("#enviar"), nota = $("#nota-boton");
  $("#permiso-texto").textContent = PERMISO[lang];
  $("#con-registro").hidden = !conRegistro;
  $("#sin-registro").hidden = conRegistro;
  function opcion() { var r = document.querySelector('input[name="opcion"]:checked'); return r ? r.value : null; }
  function pintarBoton() {
    var op = opcion();
    document.querySelectorAll(".opcion").forEach(function (o) { o.classList.toggle("escogida", !!o.querySelector("input:checked")); });
    var enlace = op && op !== "guion" ? enlaceDe(op) : null;
    $("#legal-pago").textContent = enlace ? T.legalPago : T.legalSinPago;
    if (!conRegistro) {
      var directo = op ? enlaceDirecto(op) : null, pd = $("#pagar-directo"), ll = $("#llamar");
      if (pd) { pd.hidden = !directo; if (directo) { pd.href = directo; pd.textContent = T.pagarDirecto(OPC[op].precio); } }
      ll.className = "boton " + (directo ? "boton-linea" : "boton-miel");
      $("#legal-pago").textContent = directo ? T.legalPago : T.legalSinPago;
      $("#sin-registro-texto").textContent = directo ? T.sinRegistroPago(OPC[op][lang]) : T.sinRegistro(op ? OPC[op][lang] : "");
      ll.textContent = directo ? T.llamarAntes : (op ? T.llamarCon(OPC[op][lang]) : T.llamar);
      return;
    }
    if (!op) { boton.textContent = T.pedir; nota.textContent = T.escogePrimero; return; }
    nota.textContent = "";
    if (op === "guion") boton.textContent = T.guionBtn;
    else if (enlace) boton.textContent = T.pagar(OPC[op].precio);
    else boton.textContent = T.pedir;
  }
  form.addEventListener("change", function (ev) { if (ev.target.name === "opcion") pintarBoton(); });
  // Al corregir un campo, se le quita la marca roja.
  function limpiarMarca(ev) { if (ev.target.getAttribute && ev.target.getAttribute("aria-invalid")) ev.target.removeAttribute("aria-invalid"); }
  form.addEventListener("input", limpiarMarca);
  form.addEventListener("change", limpiarMarca);
  pintarBoton();
  // Botones de las tarjetas de precio: marcan la opción y bajan al cierre.
  document.querySelectorAll("[data-escoger]").forEach(function (a) {
    a.addEventListener("click", function () {
      var r = document.querySelector('input[name="opcion"][value="' + a.getAttribute("data-escoger") + '"]');
      if (r && !r.disabled) { r.checked = true; pintarBoton(); }
    });
  });

  function telValido(t) {
    var d = t.replace(/\D/g, "");
    if (/^\s*\+/.test(t)) return d.length >= 8 && d.length <= 15;
    return d.length === 10 || (d.length === 11 && d.charAt(0) === "1");
  }
  function errores(lista) {
    var caja = $("#errores");
    caja.hidden = !lista.length;
    caja.innerHTML = "";
    if (!lista.length) return;
    var ul = document.createElement("ul");
    lista.forEach(function (e) { var li = document.createElement("li"); li.textContent = e; ul.appendChild(li); });
    caja.appendChild(ul);
  }
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!conRegistro || boton.disabled) return;
    var op = opcion();
    var nombre = $("#c-nombre").value.trim(), negocio = $("#c-negocio").value.trim(), tel = $("#c-tel").value.trim();
    var lista = [], malos = [];
    if (!op) { lista.push(T.errOpcion); malos.push('input[name="opcion"]:not(:disabled)'); }
    if (!nombre) { lista.push(T.errNombre); malos.push("#c-nombre"); }
    if (!negocio) { lista.push(T.errNegocio); malos.push("#c-negocio"); }
    if (!telValido(tel)) { lista.push(T.errTel); malos.push("#c-tel"); }
    if (!$("#c-permiso").checked) { lista.push(T.errPermiso); malos.push("#c-permiso"); }
    ["#c-nombre", "#c-negocio", "#c-tel", "#c-permiso"].forEach(function (s) {
      if (malos.indexOf(s) >= 0) $(s).setAttribute("aria-invalid", "true"); else $(s).removeAttribute("aria-invalid");
    });
    errores(lista);
    if (lista.length) { var f = $(malos[0]); if (f && f.focus) f.focus(); return; }

    var enlace = op === "guion" ? null : enlaceDe(op);
    var qs = {}; try { new URLSearchParams(location.search).forEach(function (v, k) { if (/^(utm_\w+|pieza|red)$/.test(k)) qs[k] = v.slice(0, 80); }); } catch (e) {}
    // Al punto de entrada propio de la oferta. La app añade la IP y el navegador al guardar el permiso.
    var datos = {
      tipo: "pedido_explicador",
      nombre: nombre.slice(0, 60),
      negocio: negocio.slice(0, 80),
      telefono: tel.slice(0, 20),
      idioma: lang,
      opcion: op,
      semana: cupo.semanaPedido ? iso(cupo.semanaPedido) : null,
      va_a_pago: !!enlace,
      origen: { pagina: location.pathname, parametros: qs },
      consentimiento: {
        version: PERMISO.version, entidad: PERMISO.entidad, idioma: lang, texto: PERMISO[lang],
        marcado: true, marcado_en: new Date().toISOString()
      },
      enviado_en: new Date().toISOString()
    };
    boton.disabled = true; boton.textContent = T.enviando;
    function listo(id) {
      if (enlace) { nota.textContent = T.alPago; location.href = enlace; return; }
      var o = OPC[op][lang] + (OPC[op].precio ? " (" + OPC[op].precio + (op === "mensual" ? (lang === "en" ? " a month" : " al mes") : "") + ")" : "");
      $("#ok-tit").textContent = T.okTit;
      $("#ok-texto").textContent = (op === "guion" ? T.okGuion : T.okReserva(o, cupo.semanaPedido ? T.semanaDe(cupo.semanaPedido) : "")) + " " + T.okId(id);
      $("#ok-pie").textContent = T.okPie;
      form.hidden = true;
      var ok = $("#ok"); ok.hidden = false;
      try { ok.focus(); ok.scrollIntoView({ block: "start" }); } catch (e) {}
    }
    function fallo() { boton.disabled = false; pintarBoton(); errores([T.noEnvio]); }
    try {
      fetch(C.registroApi, {
        method: "POST", credentials: "omit",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos)
      })
        .then(function (r) { return r.json().catch(function () { return null; }).then(function (j) { return { s: r.status, j: j }; }); })
        .then(function (x) {
          // Solo un «sí» claro del servidor cuenta: 2xx, ok:true y un número de pedido.
          if (x.s >= 200 && x.s < 300 && x.j && x.j.ok === true && x.j.id) listo(String(x.j.id).slice(0, 40));
          else fallo();
        }, fallo);
    } catch (e) { fallo(); }
  });

  leerCupo();
})();
