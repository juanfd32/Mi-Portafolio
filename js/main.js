console.log("main.js loaded! readyState = " + document.readyState);

function initPortfolio() {
  console.log("Initializing portfolio scripts...");

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (mobileMenuToggle && navLinksContainer) {
    mobileMenuToggle.addEventListener('click', () => {
      const isVisible = navLinksContainer.style.display === 'flex';
      navLinksContainer.style.display = isVisible ? 'none' : 'flex';
      navLinksContainer.style.flexDirection = 'column';
      navLinksContainer.style.position = 'absolute';
      navLinksContainer.style.top = '70px';
      navLinksContainer.style.left = '0';
      navLinksContainer.style.width = '100%';
      navLinksContainer.style.background = 'rgba(6, 9, 19, 0.95)';
      navLinksContainer.style.padding = '1.5rem';
      navLinksContainer.style.borderBottom = '1px solid var(--border-color)';
    });
  }


  // ==========================================
  // SCROLL-TRIGGERED REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-element');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to track it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  // ==========================================
  // ACADEMIC TIMELINE TAB SWITCHER
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const timelineContainers = document.querySelectorAll('.timeline-container');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all buttons & containers
      tabButtons.forEach(b => b.classList.remove('active'));
      timelineContainers.forEach(c => c.classList.remove('active'));

      // Activate clicked tab
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetContainer = document.getElementById(targetId);
      if (targetContainer) {
        targetContainer.classList.add('active');
        
        // Re-observe any reveal elements in the newly visible tab
        const hiddenReveals = targetContainer.querySelectorAll('.reveal-element');
        hiddenReveals.forEach(el => {
          revealObserver.observe(el);
        });
      }
    });
  });


  // ==========================================
  // FriendSpace PROJECT SIMULATOR LOGIC
  // ==========================================
  const friendBtn = document.getElementById('fb-friend-btn');
  const friendStatus = document.getElementById('fb-friend-status');
  const fbInput = document.getElementById('fb-input');
  const fbPostBtn = document.getElementById('fb-post-btn');
  const fbFeed = document.getElementById('fb-feed');

  // Toggle Friend Request
  if (friendBtn && friendStatus) {
    friendBtn.addEventListener('click', () => {
      const isAccepted = friendBtn.classList.contains('accepted');
      if (isAccepted) {
        friendBtn.classList.remove('accepted');
        friendBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> <span id="fb-friend-status">Aceptar Solicitud</span>';
      } else {
        friendBtn.classList.add('accepted');
        friendBtn.innerHTML = '<i class="fa-solid fa-user-check"></i> <span id="fb-friend-status">Amigos ✔</span>';
      }
    });
  }

  // Like System (Delega clicks de botones "Me gusta" dinámicos y estáticos)
  if (fbFeed) {
    fbFeed.addEventListener('click', (e) => {
      const likeBtn = e.target.closest('.like-btn');
      if (likeBtn) {
        const postId = likeBtn.getAttribute('data-target');
        const countEl = document.getElementById(`like-count-${postId}`);
        const isLiked = likeBtn.classList.contains('liked');

        if (countEl) {
          let currentLikes = parseInt(countEl.innerText, 10);
          if (isLiked) {
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '<i class="fa-regular fa-thumbs-up"></i> Me gusta';
            countEl.innerText = currentLikes - 1;
          } else {
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '<i class="fa-solid fa-thumbs-up"></i> Te gusta';
            countEl.innerText = currentLikes + 1;
          }
        }
      }

      // Comentar Focus
      const commentFocusBtn = e.target.closest('.comment-focus-btn');
      if (commentFocusBtn) {
        const postEl = commentFocusBtn.closest('.fb-post');
        const inputEl = postEl.querySelector('.fb-comment-input');
        if (inputEl) {
          inputEl.focus();
        }
      }
    });

    // Handle Comment submissions via Enter
    fbFeed.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.target.classList.contains('fb-comment-input')) {
        const input = e.target;
        const text = input.value.trim();
        const postId = input.getAttribute('data-post-id');
        const newCommentsBox = document.getElementById(`new-comments-${postId}`);
        const postEl = input.closest('.fb-post');
        const countLabel = postEl.querySelector('.comment-count-label');

        if (text && newCommentsBox) {
          // Create comment element
          const commentDiv = document.createElement('div');
          commentDiv.className = 'fb-comment';
          commentDiv.innerHTML = `
            <div class="fb-avatar" style="background:#7928ca; width:24px; height:24px; font-size:0.6rem">Vis</div>
            <div class="fb-comment-bubble">
              <div class="fb-comment-author">Visitante Portafolio</div>
              <div>${escapeHTML(text)}</div>
            </div>
          `;
          
          // Add to list
          newCommentsBox.appendChild(commentDiv);
          input.value = '';

          // Increment count label
          if (countLabel) {
            const countMatch = countLabel.innerText.match(/\d+/);
            const currentCount = countMatch ? parseInt(countMatch[0], 10) : 0;
            countLabel.innerText = `${currentCount + 1} comentarios`;
          }
        }
      }
    });
  }

  // Post Composer
  let postCounter = 1; // Default post ID starts from 1 (the static post)
  
  if (fbPostBtn && fbInput && fbFeed) {
    const publishPost = () => {
      const content = fbInput.value.trim();
      if (!content) return;

      postCounter++;
      
      // Create new post element
      const postDiv = document.createElement('div');
      postDiv.className = 'fb-post';
      postDiv.setAttribute('data-id', `post-${postCounter}`);
      postDiv.innerHTML = `
        <div class="fb-post-header">
          <div class="fb-avatar" style="background:#7928ca">JC</div>
          <div class="fb-post-info">
            <span class="fb-post-author">Juan Carlos Feliu Diaz</span>
            <span class="fb-post-time">Hace unos segundos</span>
          </div>
        </div>
        <div class="fb-post-content">${escapeHTML(content)}</div>
        <div class="fb-post-stats">
          <span><i class="fa-solid fa-thumbs-up" style="color:#1877f2"></i> <span class="like-count" id="like-count-${postCounter}">0</span> personas</span>
          <span class="comment-count-label">0 comentarios</span>
        </div>
        <div class="fb-post-actions">
          <button class="fb-action-btn like-btn" data-target="${postCounter}">
            <i class="fa-regular fa-thumbs-up"></i> Me gusta
          </button>
          <button class="fb-action-btn comment-focus-btn">
            <i class="fa-regular fa-comment"></i> Comentar
          </button>
        </div>
        <div class="fb-comments">
          <div class="fb-new-comments" id="new-comments-${postCounter}"></div>
          <div class="fb-comment-input-area">
            <input type="text" class="fb-comment-input" data-post-id="${postCounter}" placeholder="Escribe un comentario y presiona Enter...">
          </div>
        </div>
      `;

      // Insert immediately after the composer
      const composer = fbFeed.querySelector('.fb-composer');
      composer.insertAdjacentElement('afterend', postDiv);

      fbInput.value = '';
    };

    fbPostBtn.addEventListener('click', publishPost);
    fbInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        publishPost();
      }
    });
  }


  // ==========================================
  // ROLES EXPLORER DATA & LOGIC
  // ==========================================
  const rolesData = {
    pm: {
      title: "Director de Proyecto (Project Manager)",
      badge: "Leader",
      badgeClass: "leader",
      desc: "<p>El Director de Proyecto es el líder principal de la iniciativa. Se encarga de la planificación estratégica general, asignar responsabilidades al equipo técnico, controlar el presupuesto financiero y gestionar la matriz de riesgos del proyecto.</p><h5>Responsabilidades Clave:</h5><ul><li>Definir la planificación del cronograma (Gantt, hitos de entrega).</li><li>Monitorear el avance operacional y el uso de recursos.</li><li>Realizar estimaciones realistas del esfuerzo de desarrollo.</li><li>Establecer canales de comunicación estables con el Sponsor.</li></ul>"
    },
    sponsor: {
      title: "Patrocinador (Project Sponsor)",
      badge: "Sponsor",
      badgeClass: "sponsor",
      desc: "<p>Es la autoridad ejecutiva o el cliente que provee el financiamiento oficial del proyecto de software. Su foco principal consiste en garantizar que los resultados de la aplicación aporten valor directo y se alineen con la visión comercial de la organización.</p><h5>Responsabilidades Clave:</h5><ul><li>Proveer e impulsar el financiamiento y aprobación del presupuesto.</li><li>Garantizar que el sistema cumpla los objetivos del negocio.</li><li>Aprobar o desestimar cambios estructurales propuestos en el alcance.</li><li>Firmar actas de cierre y recepcionar formalmente los entregables.</li></ul>"
    },
    scrum: {
      title: "Líder Técnico o Scrum Master",
      badge: "Scrum Master",
      badgeClass: "leader",
      desc: "<p>En proyectos de base tecnológica, actúa como el facilitador del equipo técnico. Su misión principal es maximizar la eficiencia productiva de los desarrolladores eliminando obstáculos, bloqueos de arquitectura o dependencias operativas.</p><h5>Responsabilidades Clave:</h5><ul><li>Eliminar cuellos de botella técnicos en la codificación e infraestructura.</li><li>Facilitar reuniones ágiles diarias (standups) y revisiones de sprint.</li><li>Asesorar al equipo en la adopción de buenas prácticas de código.</li><li>Servir de puente entre el PM y los programadores.</li></ul>"
    },
    team: {
      title: "Equipo Operativo (Miembros del Equipo)",
      badge: "Operational",
      badgeClass: "op",
      desc: "<p>Son los profesionales especialistas encargados de materializar el software en código real. Incluye analistas funcionales, diseñadores UX/UI, ingenieros de bases de datos y programadores backend/frontend.</p><h5>Responsabilidades Clave:</h5><ul><li>Analizar los requerimientos funcionales documentados por el analista.</li><li>Modelar diagramas de casos de uso, secuencia, clases y base de datos.</li><li>Escribir y compilar código estructurado (Python, JavaScript, etc.).</li><li>Ejecutar pruebas unitarias de integración antes de liberar entregables.</li></ul>"
    },
    users: {
      title: "Usuarios Finales (Stakeholder Externo)",
      badge: "External",
      badgeClass: "ext",
      desc: "<p>Representan a las personas que interactuarán directamente con el software en su día a día. Sus comentarios y pruebas de usabilidad son fundamentales para guiar el refinamiento del sistema.</p><h5>Responsabilidades Clave:</h5><ul><li>Participar activamente en el levantamiento de información inicial (entrevistas, encuestas).</li><li>Realizar las Pruebas de Aceptación del Usuario (UAT) oficiales.</li><li>Reportar fallas lógicas o de interfaz detectadas en producción.</li><li>Garantizar el correcto uso operativo final del sistema.</li></ul>"
    }
  };

  const roleCards = document.querySelectorAll('.role-selector-card');
  const reqRoleBadge = document.getElementById('req-role-badge');
  const reqRoleTitle = document.getElementById('req-role-title');
  const reqRoleDescription = document.getElementById('req-role-description');

  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      console.log("Card clicked: " + card.getAttribute('data-role'));
      // Deactivate other cards
      roleCards.forEach(c => c.classList.remove('active'));
      // Activate this card
      card.classList.add('active');

      const roleKey = card.getAttribute('data-role');
      const data = rolesData[roleKey];
      console.log("Role data: ", data);

      if (data && reqRoleBadge && reqRoleTitle && reqRoleDescription) {
        // Update content
        reqRoleBadge.innerText = data.badge;
        reqRoleBadge.className = `role-badge ${data.badgeClass}`;
        reqRoleTitle.innerText = data.title;
        reqRoleDescription.innerHTML = data.desc;
        console.log("Details updated for role: " + roleKey);
      } else {
        console.log("Failed to update details: data =", !!data, "badge =", !!reqRoleBadge, "title =", !!reqRoleTitle, "desc =", !!reqRoleDescription);
      }
    });
  });


  // ==========================================
  // REQUIREMENTS FUNCTIONAL VS NON-FUNCTIONAL TABS
  // ==========================================
  const reqTypeBtns = document.querySelectorAll('.req-type-btn');
  const reqTypeListsBox = document.getElementById('req-type-lists');

  const requirementsText = {
    funcionales: `
      <div class="req-list-block reveal-element revealed">
        <h4><i class="fa-solid fa-list-check"></i> Definición</h4>
        <p style="font-size:0.9rem; margin-bottom:1rem;">Describen los servicios o funciones específicas que el sistema debe ejecutar de forma obligatoria para dar respuesta a las acciones del usuario final.</p>
        <ul>
          <li>Registrar usuarios nuevos en la base de datos MySQL.</li>
          <li>Iniciar sesión mediante validación de credenciales.</li>
          <li>Generar reportes consolidados del estado de tareas.</li>
          <li>Realizar búsquedas indexadas de perfiles o amigos.</li>
        </ul>
      </div>
      <div class="req-list-block reveal-element revealed">
        <h4><i class="fa-solid fa-diagram-project"></i> Modelamiento UML Asociado</h4>
        <p style="font-size:0.9rem; margin-bottom:1rem;">Los requerimientos funcionales se modelan mediante casos de uso para mapear las interacciones lógicas entre los actores y el sistema de software:</p>
        <ul>
          <li><strong>Diagramas de Casos de Uso:</strong> Mapean objetivos de actores.</li>
          <li><strong>Diagramas de Secuencia:</strong> Ilustran mensajes en orden temporal.</li>
          <li><strong>Diagramas de Actividades:</strong> Describen flujos operacionales.</li>
          <li><strong>Diagramas de Clases:</strong> Definen la estructura y objetos en código.</li>
        </ul>
      </div>
    `,
    'no-funcionales': `
      <div class="req-list-block reveal-element revealed">
        <h4><i class="fa-solid fa-shield-halved"></i> Calidad del Sistema</h4>
        <p style="font-size:0.9rem; margin-bottom:1rem;">Establecen propiedades y restricciones de calidad del sistema de software que determinan la experiencia de uso global.</p>
        <ul>
          <li><strong>Seguridad:</strong> Cifrado de contraseñas de usuario y control de accesos.</li>
          <li><strong>Rendimiento:</strong> Tiempo de respuesta inferior a 2 segundos en carga de feed.</li>
          <li><strong>Disponibilidad:</strong> Operación ininterrumpida del servidor del 99.9% de uptime.</li>
          <li><strong>Usabilidad:</strong> Interfaz autodescriptiva intuitiva para usuarios sin capacitación.</li>
        </ul>
      </div>
      <div class="req-list-block reveal-element revealed">
        <h4><i class="fa-solid fa-arrows-spin"></i> Atributos de Transición</h4>
        <p style="font-size:0.9rem; margin-bottom:1rem;">Condiciones que facilitan el mantenimiento técnico del código a largo plazo por otros desarrolladores:</p>
        <ul>
          <li><strong>Portabilidad:</strong> Compatibilidad con navegadores Chromium, Firefox y Webkit.</li>
          <li><strong>Mantenibilidad:</strong> Código estructurado y modular documentado.</li>
          <li><strong>Escalabilidad:</strong> Arquitectura capaz de aumentar almacenamiento de archivos.</li>
          <li><strong>Tolerancia a fallos:</strong> Manejo estructurado de excepciones lógicas.</li>
        </ul>
      </div>
    `
  };

  reqTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log("Tab clicked: " + btn.getAttribute('data-type'));
      reqTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const typeKey = btn.getAttribute('data-type');
      console.log("Type key: " + typeKey);
      if (reqTypeListsBox && requirementsText[typeKey]) {
        reqTypeListsBox.innerHTML = requirementsText[typeKey];
        console.log("Tab content updated!");
      } else {
        console.log("Failed to update tab content: box =", !!reqTypeListsBox, "text =", !!requirementsText[typeKey]);
      }
    });
  });


  // ==========================================
  // ACTIVE NAV STATE ON SCROLL
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentSectionId = 'home';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // If scroll position is past section top minus offset
      if (window.scrollY >= (sectionTop - 120)) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });


  // ==========================================
  // CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const msg = document.getElementById('contact-msg').value.trim();

      if (name && email && msg) {
        // Enviar a Formspree
        try {
          const response = await fetch('https://formspree.io/f/mqevznzq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name, email, message: msg })
          });

          // Crear overlay de confirmación
          const overlay = document.createElement('div');
          overlay.className = 'confirm-overlay';

          const now = new Date();
          const timestamp = now.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }) + ' — ' + now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

          if (response.ok) {
            overlay.innerHTML = `
              <div class="confirm-card confirm-success">
                <div class="confirm-icon-wrap">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
                <h3>¡Mensaje Enviado!</h3>
                <p class="confirm-subtitle">Tu mensaje ha sido entregado exitosamente a Juan Carlos.</p>
                <div class="confirm-details">
                  <div class="confirm-row">
                    <span class="confirm-label"><i class="fa-solid fa-user"></i> Nombre</span>
                    <span class="confirm-value">${name}</span>
                  </div>
                  <div class="confirm-row">
                    <span class="confirm-label"><i class="fa-solid fa-envelope"></i> Correo</span>
                    <span class="confirm-value">${email}</span>
                  </div>
                  <div class="confirm-row">
                    <span class="confirm-label"><i class="fa-solid fa-clock"></i> Enviado</span>
                    <span class="confirm-value">${timestamp}</span>
                  </div>
                </div>
                <button class="confirm-close-btn" onclick="this.closest('.confirm-overlay').remove()">
                  <i class="fa-solid fa-check"></i> Entendido
                </button>
              </div>
            `;
            contactForm.reset();
          } else {
            overlay.innerHTML = `
              <div class="confirm-card confirm-error">
                <div class="confirm-icon-wrap error">
                  <i class="fa-solid fa-circle-xmark"></i>
                </div>
                <h3>Error al Enviar</h3>
                <p class="confirm-subtitle">No se pudo entregar tu mensaje. Intenta nuevamente.</p>
                <button class="confirm-close-btn error" onclick="this.closest('.confirm-overlay').remove()">
                  <i class="fa-solid fa-rotate-right"></i> Cerrar
                </button>
              </div>
            `;
          }

          document.body.appendChild(overlay);
          // Animate in
          requestAnimationFrame(() => overlay.classList.add('active'));

          // Cerrar al hacer click fuera
          overlay.addEventListener('click', (ev) => {
            if (ev.target === overlay) overlay.remove();
          });

        } catch (err) {
          alert('Error de conexión. Verifica tu internet e intenta de nuevo.');
        }
      }
    });
  }


  // ==========================================
  // FLOATING WHATSAPP BUTTON
  // ==========================================
  const waBtn = document.createElement('a');
  waBtn.href = 'https://wa.me/56949315061?text=Hola%20Juan%20Carlos%2C%20vi%20tu%20portafolio%20y%20me%20gustar%C3%ADa%20contactarte.';
  waBtn.target = '_blank';
  waBtn.className = 'whatsapp-float';
  waBtn.title = 'Escríbeme por WhatsApp';
  waBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
  document.body.appendChild(waBtn);


  // ==========================================
  // LIGHTBOX - ZOOM DE IMÁGENES
  // ==========================================

  // Crear el overlay del lightbox una sola vez
  const lightboxOverlay = document.createElement('div');
  lightboxOverlay.className = 'lightbox-overlay';
  lightboxOverlay.innerHTML = `
    <button class="lightbox-close" id="lightbox-close-btn" title="Cerrar (Esc)">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <img id="lightbox-img" src="" alt="">
    <div class="lightbox-caption" id="lightbox-caption"></div>
  `;
  document.body.appendChild(lightboxOverlay);

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  function openLightbox(src, alt, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCaption.textContent = caption || alt;
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  // Click en imágenes dentro de .img-container
  document.querySelectorAll('.img-container img').forEach(img => {
    img.addEventListener('click', () => {
      const captionEl = img.closest('.img-container').querySelector('.img-caption');
      const captionText = captionEl ? captionEl.textContent.trim() : '';
      openLightbox(img.src, img.alt, captionText);
    });
  });

  // Cerrar con botón X
  lightboxCloseBtn.addEventListener('click', closeLightbox);

  // Cerrar al hacer click fuera de la imagen
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });


  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded fired!");
    initPortfolio();
  });
} else {
  console.log("DOM already ready, initializing immediately.");
  initPortfolio();
}

