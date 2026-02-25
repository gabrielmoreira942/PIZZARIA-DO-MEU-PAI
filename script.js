/* =====================================================================
   🍕 FORNO D'ORO — PIZZARIA PREMIUM
   Script principal: Cardápio, Carrinho, Timer, Animações e Conversão
   
   Estrutura preparada para integração futura com API:
   - pizzaData pode ser substituído por fetch() de uma API REST
   - addToCart / removeFromCart podem enviar para backend
   - checkout pode integrar com gateway de pagamento
   ===================================================================== */

'use strict';

/* =====================================================================
   DATA — Catálogo de Pizzas (pronto para ser substituído por API)
   ===================================================================== */
const pizzaData = [
    {
        id: 1,
        name: 'Margherita Clássica',
        description: 'Molho de tomate San Marzano, mozzarella di bufala, manjericão fresco e azeite extra-virgem.',
        price: 44.90,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
        category: 'tradicionais',
        badge: 'popular',
        badgeLabel: '⭐ Mais Pedida'
    },
    {
        id: 2,
        name: 'Pepperoni Suprema',
        description: 'Generosas fatias de pepperoni artesanal, mozzarella derretida e orégano italiano.',
        price: 49.90,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
        category: 'tradicionais',
        badge: 'popular',
        badgeLabel: '🔥 Best Seller'
    },
    {
        id: 3,
        name: 'Quattro Formaggi',
        description: 'Gorgonzola, parmesão, mozzarella e provolone. Uma explosão de sabor para os amantes de queijo.',
        price: 54.90,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        category: 'especiais',
        badge: null,
        badgeLabel: null
    },
    {
        id: 4,
        name: 'Funghi e Tartufo',
        description: 'Cogumelos porcini, trufas negras, creme de leite fresco e raspas de parmesão.',
        price: 69.90,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
        category: 'premium',
        badge: 'premium',
        badgeLabel: '👑 Premium'
    },
    {
        id: 5,
        name: 'Portuguesa Especial',
        description: 'Presunto, ovos, cebola, azeitonas, ervilha e mozzarella. A tradição brasileira.',
        price: 46.90,
        image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=600&q=80',
        category: 'tradicionais',
        badge: null,
        badgeLabel: null
    },
    {
        id: 6,
        name: 'Parma Rúcula',
        description: 'Presunto de Parma 24 meses, rúcula selvagem, lascas de parmesão e redução de balsâmico.',
        price: 64.90,
        image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
        category: 'premium',
        badge: 'premium',
        badgeLabel: '👑 Premium'
    },
    {
        id: 7,
        name: 'Calabresa Artesanal',
        description: 'Calabresa defumada artesanalmente, cebola caramelizada e mozzarella fior di latte.',
        price: 42.90,
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
        category: 'tradicionais',
        badge: null,
        badgeLabel: null
    },
    {
        id: 8,
        name: 'Caprese Premium',
        description: 'Tomates cereja orgânicos, mozzarella de búfala, pesto genovês e azeite trufado.',
        price: 59.90,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
        category: 'especiais',
        badge: 'new',
        badgeLabel: '✨ Novidade'
    },
];

/* =====================================================================
   CART STATE
   ===================================================================== */
let cart = [];

/* =====================================================================
   DOM CACHE — Elementos referenciados frequentemente
   ===================================================================== */
const DOM = {
    navbar: document.getElementById('navbar'),
    menuGrid: document.getElementById('menu-grid'),
    cartOverlay: document.getElementById('cart-overlay'),
    cart: document.getElementById('cart'),
    cartItems: document.getElementById('cart-items'),
    cartEmpty: document.getElementById('cart-empty'),
    cartTotal: document.getElementById('cart-total'),
    cartFooter: document.getElementById('cart-footer'),
    cartCountNav: document.getElementById('cart-count-nav'),
    cartCountSticky: document.getElementById('cart-count-sticky'),
    cartTotalSticky: document.getElementById('cart-total-sticky'),
    cartToggleNav: document.getElementById('cart-toggle-nav'),
    cartClose: document.getElementById('cart-close'),
    cartCheckout: document.getElementById('cart-checkout'),
    stickyCartBtn: document.getElementById('sticky-cart-btn'),
    stickyCta: document.getElementById('sticky-cta'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    modalOverlay: document.getElementById('modal-overlay'),
    modalClose: document.getElementById('modal-close'),
    orderNumber: document.getElementById('order-number'),
    timerHours: document.getElementById('timer-hours'),
    timerMinutes: document.getElementById('timer-minutes'),
    timerSeconds: document.getElementById('timer-seconds'),
    offerRemaining: document.getElementById('offer-remaining'),
    offerCta: document.getElementById('offer-cta'),
    filterBtns: document.querySelectorAll('.menu__filter'),
};

/* =====================================================================
   INITIALIZE
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    renderMenu('todas');
    initCartEvents();
    initNavbarScroll();
    initFilterTabs();
    initCountdownTimer();
    initScrollAnimations();
    initOfferCTA();
    initStickyMobileCTA();
});

/* =====================================================================
   MENU RENDERING — Renderiza cards de pizza no grid
   ===================================================================== */
function renderMenu(filter = 'todas') {
    const filteredPizzas = filter === 'todas'
        ? pizzaData
        : pizzaData.filter(p => p.category === filter);

    DOM.menuGrid.innerHTML = filteredPizzas.map(pizza => `
        <div class="pizza-card animate-on-scroll visible" data-category="${pizza.category}">
            ${pizza.badge ? `
                <span class="pizza-card__badge pizza-card__badge--${pizza.badge}">
                    ${pizza.badgeLabel}
                </span>
            ` : ''}
            <div class="pizza-card__image-wrapper">
                <img 
                    class="pizza-card__image" 
                    src="${pizza.image}" 
                    alt="${pizza.name}"
                    loading="lazy"
                />
            </div>
            <div class="pizza-card__content">
                <h3 class="pizza-card__name">${pizza.name}</h3>
                <p class="pizza-card__desc">${pizza.description}</p>
                <div class="pizza-card__footer">
                    <span class="pizza-card__price">
                        R$ ${pizza.price.toFixed(2).replace('.', ',')}
                        <small> / grande</small>
                    </span>
                    <button 
                        class="pizza-card__add-btn" 
                        onclick="addToCart(${pizza.id})"
                        aria-label="Adicionar ${pizza.name} ao carrinho"
                        title="Adicionar ao carrinho"
                    >
                        <i class="ph ph-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/* =====================================================================
   FILTER TABS — Alterna categorias no cardápio
   ===================================================================== */
function initFilterTabs() {
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active state
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            renderMenu(filter);
        });
    });
}

/* =====================================================================
   CART LOGIC — Adicionar, remover e atualizar carrinho
   ===================================================================== */
function addToCart(pizzaId) {
    const pizza = pizzaData.find(p => p.id === pizzaId);
    if (!pizza) return;

    const existing = cart.find(item => item.id === pizzaId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...pizza, quantity: 1 });
    }

    updateCartUI();
    showToast(`${pizza.name} adicionado ao carrinho!`);
    bumpCartCount();
}

function addOfferToCart(name, price) {
    const existingOffer = cart.find(item => item.name === name);
    if (existingOffer) {
        existingOffer.quantity++;
    } else {
        cart.push({
            id: 'offer-' + Date.now(),
            name: name,
            price: parseFloat(price),
            quantity: 1,
        });
    }

    updateCartUI();
    showToast(`${name} adicionado ao carrinho! 🎉`);
    bumpCartCount();
    openCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
        return;
    }
    updateCartUI();
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/* =====================================================================
   CART UI — Atualiza visualmente o carrinho
   ===================================================================== */
function updateCartUI() {
    const count = getCartCount();
    const total = getCartTotal();
    const totalFormatted = `R$ ${total.toFixed(2).replace('.', ',')}`;

    // Update counters
    DOM.cartCountNav.textContent = count;
    DOM.cartCountSticky.textContent = count;
    DOM.cartTotalSticky.textContent = totalFormatted;
    DOM.cartTotal.textContent = totalFormatted;

    // Toggle empty state
    if (cart.length === 0) {
        DOM.cartEmpty.style.display = 'flex';
        DOM.cartFooter.style.display = 'none';
        // Remove rendered items
        document.querySelectorAll('.cart-item').forEach(el => el.remove());
        return;
    }

    DOM.cartEmpty.style.display = 'none';
    DOM.cartFooter.style.display = 'block';

    // Render items
    const itemsHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item__info">
                <div class="cart-item__name">${item.name}</div>
                <div class="cart-item__price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="cart-item__controls">
                <button class="cart-item__btn" onclick="changeQuantity(${index}, -1)" aria-label="Diminuir quantidade">−</button>
                <span class="cart-item__qty">${item.quantity}</span>
                <button class="cart-item__btn" onclick="changeQuantity(${index}, 1)" aria-label="Aumentar quantidade">+</button>
                <button class="cart-item__remove" onclick="removeFromCart(${index})" aria-label="Remover item">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Remove old items and insert new
    document.querySelectorAll('.cart-item').forEach(el => el.remove());
    DOM.cartEmpty.insertAdjacentHTML('beforebegin', itemsHTML);

    // Show sticky CTA on mobile if items exist
    updateStickyCTA();
}

function bumpCartCount() {
    DOM.cartCountNav.classList.add('bump');
    setTimeout(() => DOM.cartCountNav.classList.remove('bump'), 400);
}

/* =====================================================================
   CART OPEN/CLOSE
   ===================================================================== */
function openCart() {
    DOM.cart.classList.add('open');
    DOM.cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    DOM.cart.classList.remove('open');
    DOM.cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function initCartEvents() {
    DOM.cartToggleNav.addEventListener('click', openCart);
    DOM.cartClose.addEventListener('click', closeCart);
    DOM.cartOverlay.addEventListener('click', closeCart);
    DOM.stickyCartBtn.addEventListener('click', openCart);

    // Checkout
    DOM.cartCheckout.addEventListener('click', handleCheckout);

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            closeModal();
        }
    });
}

/* =====================================================================
   CHECKOUT — Simula envio do pedido
   ===================================================================== */
function handleCheckout() {
    if (cart.length === 0) return;

    // Generate order number
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    DOM.orderNumber.textContent = orderNum;

    // Close cart and show modal
    closeCart();

    setTimeout(() => {
        DOM.modalOverlay.classList.add('active');
    }, 300);

    // Clear cart after "order"
    cart = [];
    updateCartUI();

    // Close modal event
    DOM.modalClose.addEventListener('click', closeModal);
    DOM.modalOverlay.addEventListener('click', (e) => {
        if (e.target === DOM.modalOverlay) closeModal();
    });
}

function closeModal() {
    DOM.modalOverlay.classList.remove('active');
}

/* =====================================================================
   OFFER CTA — Adicionar combo ao carrinho
   ===================================================================== */
function initOfferCTA() {
    DOM.offerCta.addEventListener('click', () => {
        const name = DOM.offerCta.dataset.name;
        const price = DOM.offerCta.dataset.price;
        addOfferToCart(name, price);
    });
}

/* =====================================================================
   TOAST NOTIFICATION
   ===================================================================== */
function showToast(message) {
    DOM.toastMessage.textContent = message;
    DOM.toast.classList.add('show');

    setTimeout(() => {
        DOM.toast.classList.remove('show');
    }, 2500);
}

/* =====================================================================
   NAVBAR SCROLL — Efeito de fundo ao rolar
   ===================================================================== */
function initNavbarScroll() {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 80) {
                    DOM.navbar.classList.add('scrolled');
                } else {
                    DOM.navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* =====================================================================
   COUNTDOWN TIMER — Oferta com escassez · resets a cada 6h
   ===================================================================== */
function initCountdownTimer() {
    // Timer: 6 hours from page load (simulates scarcity)
    const TIMER_DURATION = 6 * 60 * 60 * 1000; // 6 hours in ms
    const STORAGE_KEY = 'pizza_offer_end';

    let endTime = localStorage.getItem(STORAGE_KEY);

    if (!endTime || Date.now() >= parseInt(endTime)) {
        endTime = Date.now() + TIMER_DURATION;
        localStorage.setItem(STORAGE_KEY, endTime);
    } else {
        endTime = parseInt(endTime);
    }

    function updateTimer() {
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) {
            // Reset timer
            endTime = Date.now() + TIMER_DURATION;
            localStorage.setItem(STORAGE_KEY, endTime);
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        DOM.timerHours.textContent = String(hours).padStart(2, '0');
        DOM.timerMinutes.textContent = String(minutes).padStart(2, '0');
        DOM.timerSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);

    // Simulate decreasing remaining offers
    simulateScarcity();
}

function simulateScarcity() {
    const baseRemaining = 23;
    let remaining = baseRemaining;

    setInterval(() => {
        if (remaining > 3) {
            if (Math.random() > 0.7) {
                remaining--;
                DOM.offerRemaining.textContent = remaining;

                // Brief highlight animation
                DOM.offerRemaining.style.color = '#FFD54F';
                setTimeout(() => {
                    DOM.offerRemaining.style.color = '';
                }, 500);
            }
        }
    }, 15000); // Every 15 seconds, chance to decrease
}

/* =====================================================================
   SCROLL ANIMATIONS — Intersection Observer for reveal
   ===================================================================== */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* =====================================================================
   STICKY MOBILE CTA — Aparece ao rolar no mobile
   ===================================================================== */
function initStickyMobileCTA() {
    updateStickyCTA();

    window.addEventListener('scroll', () => {
        updateStickyCTA();
    });
}

function updateStickyCTA() {
    const count = getCartCount();
    if (count > 0 && window.innerWidth <= 768) {
        DOM.stickyCta.classList.add('visible');
    } else {
        DOM.stickyCta.classList.remove('visible');
    }
}

/* =====================================================================
   SMOOTH SCROLL — Para links internos (polyfill-free)
   ===================================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
