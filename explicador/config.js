/* Configuración de la página de oferta del Explicador. La leen las dos versiones (es y en/).
   Regla: aquí solo va lo que es verdad hoy. Lo que no existe se deja en null y la página no lo promete.

   CUPO (OFERTA.md): 3 lugares por semana para clientes, de lunes a viernes. Único = 1 lugar; serie de 3 = 2 lugares
   repartidos en 2 semanas; mensual = 1 lugar cada semana. Máximo 2 mensuales activos a la vez.
   Guiones de muestra gratis: 2 por semana como máximo, aparte de los 3 lugares.
   - cupoApi: la ÚNICA fuente del cupo. Es la tabla de pedidos que lee Muse. GET con CORS que contesta JSON:
       { ok:true, semana:"AAAA-MM-DD" (lunes), lugares:3, tomados:n, mensuales_activos:n, guiones_semana:n }
     Mientras sea null, la página no da cifras ("producimos 3 por semana") y no manda a nadie directo al pago.
     Ya no hay números puestos a mano: un cupo a mano se queda viejo y nadie está nombrado para cambiarlo.

   REGISTRO: registroApi es un punto de entrada PROPIO de la oferta (no el de protección hipotecaria).
     POST JSON con CORS. Guarda negocio, opción, teléfono y el permiso P2 (texto, versión, fecha, hora, IP y navegador),
     no toca el flujo de seguros, y contesta { ok:true, id:"..." }. Solo con ese «ok» la página dice «Anotamos tu pedido»
     o manda al pago. Mientras sea null, la página no pide datos: dice que llames al 786-835-2214.
   whatsappEmpresa: el número de WhatsApp de la empresa, cuando exista y Muse esté probado con el teléfono de la empresa.
     Mientras sea null, la página no promete mensajes por WhatsApp.

   ENLACES DE PAGO: mientras digan «{ENLACE_DE_PAGO}», no hay pago en la página. Un enlace solo se usa si también hay
   registro y cupo en vivo (pagar aparta un lugar). Se pegan cuando existan en Stripe.
   EXCEPCIÓN DEL 14-NOV: mientras registroApi sea null, el único y la serie se pagan DIRECTO en Stripe. El enlace pide
   el nombre del negocio y un teléfono, así el pedido queda guardado en Stripe. La página dice que, si la semana está
   llena, damos la fecha del siguiente lugar y devolvemos todo si no sirve. El mensual sigue por teléfono. */
(function () {
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname); // en este equipo todo va al eco local
  window.RC_OFERTA_CONFIG = {
    actualizado: "2026-11-14",

    lugares: 3,
    mensualesMax: 2,
    guionesMax: 2,
    cupoApi: LOCAL ? "/eco/cupo" : null,

    registroApi: LOCAL ? "/eco/pedido" : null,
    whatsappEmpresa: null,
    telefono: "+1 786-835-2214",

    enlaces: {
      unico: "https://pay.reyesconnectapp.com/b/3cI8wQbUGcddbfYb55c7u03",   // US$297, pago único (plink_1Ubf0BJqjowFRRuS1sCZQabT)
      serie: "https://pay.reyesconnectapp.com/b/14A3cw5wi2CD83Mb55c7u04",   // US$597, pago único (plink_1Ubf0GJqjowFRRuSbh4OgZbV)
      mensual: "{ENLACE_DE_PAGO}"  // US$497 al mes, recurrente
    },

    video: "https://reyes-connect-inc.github.io/guias/videos/vuelos-como-se-hablan.mp4",
    youtube: "https://youtu.be/gmTs4MC2XK8"
  };
  // Solo para las pruebas en este equipo: ?eco-enlaces=1 simula enlaces de pago, ?eco-sin-app=1 simula producción hoy.
  if (LOCAL) {
    var q = location.search;
    if (/eco-enlaces=1/.test(q)) window.RC_OFERTA_CONFIG.enlaces = { unico: "https://pago.invalid/unico", serie: "https://pago.invalid/serie", mensual: "https://pago.invalid/mensual" };
    if (/eco-sin-app=1/.test(q)) { window.RC_OFERTA_CONFIG.cupoApi = null; window.RC_OFERTA_CONFIG.registroApi = null; }
    if (/eco-whatsapp=1/.test(q)) window.RC_OFERTA_CONFIG.whatsappEmpresa = "+1 000-000-0000";
  }
})();
