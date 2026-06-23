const PRODUCTS = [
  {
    id: 'violet',
    name: 'Violet',
    filament: 'Magic Silk Rose Red–Royal Blue',
    img: 'images/violet.png',
    gradient: 'linear-gradient(135deg, #7c3aed, #be185d, #3b82f6)',
    soon: false,
  },
  {
    id: 'azure',
    name: 'Azure',
    filament: 'Silk Blue',
    img: 'images/azure.png',
    gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8, #7dd3fc)',
    soon: false,
  },
  {
    id: 'tangerine',
    name: 'Tangerine',
    filament: 'Magic Silk Yellow–Orange',
    img: 'images/tangerine.png',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316, #fbbf24)',
    soon: false,
  },
  {
    id: 'ash',
    name: 'Ash',
    filament: 'Silk Silver',
    img: 'images/ash.png',
    gradient: 'linear-gradient(135deg, #d1d5db, #9ca3af, #e5e7eb)',
    soon: false,
  },
  {
    id: 'fashionpink',
    name: 'Fashion Pink',
    filament: 'Matte Pink',
    img: 'images/fashionpink.png',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6, #be185d)',
    soon: false,
  },
  {
    id: 'onyx',
    name: 'Onyx',
    filament: 'Silk Black',
    img: 'images/onyx.png',
    gradient: 'linear-gradient(135deg, #1f2937, #374151, #111827)',
    soon: false,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    filament: 'Magic Silk YBlack-Blue',
    img: null,
    gradient: 'linear-gradient(135deg, #0f172a, #1e3a5f, #1e40af)',
    soon: true,
  },
];

const SIZES = {
  big:   { label: 'Büyük Boy', dims: '22×13×18 cm', price: 4850 },
  small: { label: 'Küçük Boy', dims: '22×13×12 cm', price: 4250 },
};

let cart = [];
let activeProduct = null;
let activeSize = null;

function renderProducts() {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card" onclick="${p.soon ? '' : `openSizeModal('${p.id}')`}">
      <div class="product-img" style="background: ${p.gradient}">
        ${p.img
          ? `<img src="${p.img}" alt="${p.name}" loading="lazy">`
          : `<div class="product-img-placeholder">✿</div>`}
      </div>
      <div class="product-info">
        ${p.soon ? '<span class="soon-badge">Yakında</span>' : ''}
        <div class="product-name">${p.name}</div>
        <div class="product-filament">${p.filament}</div>
        ${!p.soon ? `
        <div class="product-price-row">
          <button class="product-add" onclick="event.stopPropagation(); openSizeModal('${p.id}')">+</button>
        </div>` : '<div style="color:var(--muted);font-size:14px">Çok yakında...</div>'}
      </div>
    </div>
  `).join('');
}

function openSizeModal(productId) {
  activeProduct = PRODUCTS.find(p => p.id === productId);
  activeSize = null;
  document.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('modal-color-name').textContent = activeProduct.name;
  const preview = document.getElementById('modal-color-preview');
  preview.style.background = activeProduct.gradient;
  if (activeProduct.img) {
    preview.innerHTML = `<img src="${activeProduct.img}" alt="${activeProduct.name}" style="width:100%;height:100%;object-fit:cover;">`;
  } else {
    preview.innerHTML = '✿';
    preview.style.fontSize = '80px';
  }
  document.getElementById('size-modal').classList.add('open');
}

function closeSizeModal() {
  document.getElementById('size-modal').classList.remove('open');
  activeProduct = null;
  activeSize = null;
}

function selectSize(size) {
  activeSize = size;
  document.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));
  document.getElementById(`size-${size}`).classList.add('selected');
}

function addToCart() {
  if (!activeSize) { alert('Lütfen bir boy seçin.'); return; }
  const size = SIZES[activeSize];
  cart.push({
    product: activeProduct,
    size: activeSize,
    sizeLabel: size.label,
    price: size.price,
  });
  updateCartUI();
  closeSizeModal();
  toggleCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const count = cart.length;
  document.getElementById('cart-count').textContent = count;
  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');

  if (count === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛍</div><p>Sepetiniz boş</p></div>`;
    footerEl.style.display = 'none';
    return;
  }

  const total = cart.reduce((s, item) => s + item.price, 0);
  itemsEl.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-color" style="background:${item.product.gradient}">
        ${item.product.img ? `<img src="${item.product.img}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">` : '✿'}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">Meli — ${item.product.name}</div>
        <div class="cart-item-sub">${item.sizeLabel}</div>
      </div>
      <div class="cart-item-price">${item.price.toLocaleString('tr-TR')} ₺</div>
      <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
    </div>
  `).join('');

  document.getElementById('cart-total').textContent = total.toLocaleString('tr-TR') + ' ₺';
  footerEl.style.display = 'block';
}

function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  drawer.classList.toggle('open');
  overlay.classList.toggle('open');
}

function openCheckout() {
  if (cart.length === 0) return;
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');

  const total = cart.reduce((s, i) => s + i.price, 0);
  document.getElementById('checkout-items-list').innerHTML = cart.map(item => `
    <div class="checkout-item-row">
      <span class="checkout-item-name">Meli ${item.product.name} — ${item.sizeLabel}</span>
      <span class="checkout-item-price">${item.price.toLocaleString('tr-TR')} ₺</span>
    </div>
  `).join('');
  document.getElementById('checkout-total-display').textContent = total.toLocaleString('tr-TR') + ' ₺';
  document.getElementById('checkout-form-view').style.display = 'block';
  document.getElementById('checkout-success-view').style.display = 'none';
  document.getElementById('checkout-modal').classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkout-modal').classList.remove('open');
}

function submitCheckout(e) {
  e.preventDefault();
  // Iyzico entegrasyonu buraya gelecek
  document.getElementById('checkout-form-view').style.display = 'none';
  document.getElementById('checkout-success-view').style.display = 'block';
  cart = [];
  updateCartUI();
}

renderProducts();
updateCartUI();
