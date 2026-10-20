// ===========================
// HERO SLIDER (Horizontal Slide)
// ===========================
(function () {
  const slides   = document.querySelectorAll('.hero-slide');
  const dots     = document.querySelectorAll('.hero-dot');
  const DURATION = 650;
  const EASE     = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  let current    = 0;
  let animating  = false;

  // ---- Set starting positions: slide 0 visible, rest off-screen to the right ----
  slides.forEach((slide, i) => {
    slide.style.transition = 'none';
    slide.style.transform  = i === 0 ? 'translateX(0%)' : 'translateX(100%)';
  });

  // ---- Go to slide ----
  function goTo(index) {
    if (index === current || animating) return;
    animating = true;

    const dir      = index > current ? 1 : -1;
    const outSlide = slides[current];
    const inSlide  = slides[index];

    // 1. Place incoming slide off-screen instantly (no transition)
    inSlide.style.transition = 'none';
    inSlide.style.transform  = `translateX(${dir * 100}%)`;

    // 2. Force browser to register the new position before animating
    inSlide.offsetWidth;

    // 3. Animate both slides at the same time
    const trans = `transform ${DURATION}ms ${EASE}`;
    inSlide.style.transition  = trans;
    outSlide.style.transition = trans;

    inSlide.style.transform  = 'translateX(0%)';
    outSlide.style.transform = `translateX(${-dir * 100}%)`;

    // 4. Update dots immediately
    dots[current].classList.remove('active');
    dots[index].classList.add('active');
    current = index;

    // 5. Unlock after animation finishes
    setTimeout(() => { animating = false; }, DURATION);
  }

  // ---- Dot click ----
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.slide));
    });
  });

  // ---- Auto-play every 5 seconds ----
  let autoPlay = setInterval(() => {
    goTo((current + 1) % slides.length);
  }, 5000);

  // Pause on dot interaction
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoPlay);
      autoPlay = setInterval(() => {
        goTo((current + 1) % slides.length);
      }, 5000);
    });
  });

})();

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
});

// ===========================
// ACTIVE NAV LINK
// ===========================
function updateActiveLink() {
  const sections = ['home', 'menu', 'about', 'book'];
  const scrollY = window.scrollY + 120;

  sections.forEach(id => {
    const section = document.getElementById(id);
    const link = document.getElementById('nav-' + id);
    if (!section || !link) return;

    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollY >= top && scrollY < bottom) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// ===========================
// HAMBURGER MENU
// ===========================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ===========================
// MENU FILTER
// ===========================
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    menuCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===========================
// WISHLIST TOGGLE
// ===========================
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const icon = btn.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
    btn.classList.toggle('liked');
  });
});

// ===========================
// CART FUNCTIONALITY
// ===========================
let cart = [];

const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const totalPriceEl = document.getElementById('totalPrice');

function openCart() {
  cartSidebar.classList.add('active');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('active');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('cartBtn').addEventListener('click', openCart);

function addToCart(btn, name, price) {
  // Get image src from the same menu card
  const card = btn.closest('.menu-card');
  const imgSrc = card ? card.querySelector('.menu-card-img img').src : '';

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1, img: imgSrc });
  }

  // Button bounce animation
  btn.style.transform = 'scale(1.3)';
  setTimeout(() => { btn.style.transform = ''; }, 200);

  renderCart();
  showToast(`${name} تمت الإضافة إلى الطلب!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  cartCountEl.textContent = count;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="empty-cart">سلة طلباتك فارغة</p>';
    cartTotalEl.style.display = 'none';
    return;
  }

  cartTotalEl.style.display = 'block';
  totalPriceEl.textContent = `${total} ج.م`;

  cartItemsEl.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}${item.qty > 1 ? ` <span class="cart-item-qty">x${item.qty}</span>` : ''}</div>
        <div class="cart-item-price">${item.price * item.qty} ج.م</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i})" aria-label="Remove item">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');
}


// ===========================
// TOAST NOTIFICATION
// ===========================
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===========================
// BOOKING FORM
// ===========================
function handleBooking(e) {
  e.preventDefault();
  const name = document.getElementById('bookName').value;
  showToast(`✅ تم حجز طاولة لـ ${name}! سنتواصل معك قريباً.`);
  e.target.reset();
}

// ===========================
// SMOOTH SCROLL OFFSET
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===========================
// INTERSECTION OBSERVER - CARDS ANIMATION
// ===========================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.menu-card, .offer-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(card);
});

// Set minimum date for booking to today
const dateInput = document.getElementById('bookDate');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}


// ===========================
// TESTIMONIALS SLIDER
// ===========================
(function () {
  const track  = document.getElementById('tTrack');
  const slides = document.querySelectorAll('.testimonials-slide');
  const total  = slides.length;
  let current  = 0;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  // Expose globally for onclick buttons
  window.testimonialPrev = () => goTo(current - 1);
  window.testimonialNext = () => goTo(current + 1);
})();



