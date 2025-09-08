import React, { useState, useEffect } from 'react';

const beers = [
  {
    id: 1,
    name: "Хмельной Закат",
    desc: "Цитрусовый IPA с нотками грейпфрута и хвои. Крепкий, насыщенный, с горчинкой.",
    abv: "6.8%",
    price: 12.9,
    img: "https://images.unsplash.com/photo-1546173159-2ed430595600?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Лесной Эль",
    desc: "Темный эль с ароматом карамели, кофе и легкой дымности. Идеален для вечера.",
    abv: "5.5%",
    price: 11.5,
    img: "https://images.unsplash.com/photo-1577995596872-444a6d77c05d?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Каарстский Лагер",
    desc: "Чистый, свежий лагер с легкой хрустящей горчинкой. Пьется как вода — но вкуснее!",
    abv: "4.9%",
    price: 9.9,
    img: "https://images.unsplash.com/photo-1540277113249-39a8b7da3d7f?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Ягодный Госсе",
    desc: "Кисло-сладкий берлинский вайс с малиной и ежевикой. Освежает даже в жару.",
    abv: "4.2%",
    price: 13.5,
    img: "https://images.unsplash.com/photo-1605559424837-22b1a9a7f68e?w=400&auto=format&fit=crop&q=80",
  },
];

const App = () => {
  const [heroText, setHeroText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [cart, setCart] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', comment: '' });
  const [orderSent, setOrderSent] = useState(false);

  // Анимация Hero
  useEffect(() => {
    const punchline = "Пиво, которое говорит с тобой 🍻";
    let i = 0;
    const timer = setInterval(() => {
      setHeroText(punchline.slice(0, ++i));
      if (i === punchline.length) clearInterval(timer);
    }, 80);
    setTimeout(() => setIsLoaded(true), 1500);
  }, []);

  // Загрузка корзины из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Сохранение корзины
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (beer) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === beer.id);
      if (existing) {
        return prev.map(item =>
          item.id === beer.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...beer, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);
  };

  const handleOrderChange = (e) => {
    setOrderForm({ ...orderForm, [e.target.name]: e.target.value });
  };

  const submitOrder = (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.phone) {
      alert('Заполните имя и телефон!');
      return;
    }
    console.log('Заказ:', { ...orderForm, cart });
    setOrderSent(true);
    setCart([]);
    setTimeout(() => setOrderSent(false), 3000);
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="container">
          <h1>Craftik Beer</h1>
          <div className="nav-desktop">
            <a href="#beers">Пиво</a>
            <a href="#map">Доставка</a>
            <a href="#order">Заказ</a>
          </div>
          <div className="nav-mobile">
            <button onClick={() => setMenuOpen(!menuOpen)} className="burger">
              ☰
            </button>
            {menuOpen && (
              <div className="mobile-menu">
                <a href="#beers" onClick={() => setMenuOpen(false)}>Пиво</a>
                <a href="#map" onClick={() => setMenuOpen(false)}>Доставка</a>
                <a href="#order" onClick={() => setMenuOpen(false)}>Заказ</a>
              </div>
            )}
          </div>
          <div className="cart-icon" onClick={() => document.getElementById('cart').scrollIntoView()}>
            🛒 {cart.reduce((sum, item) => sum + item.qty, 0)}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container hero-content">
          <h2 className="hero-punch">{heroText}</h2>
          <p className="hero-subtitle">Свежее крафтовое пиво ручной работы — прямо в Каарсте. Закажи сейчас — привезем за 30 минут.</p>
          <button className="cta-btn" onClick={() => document.getElementById('beers').scrollIntoView()}>Выбрать пиво →</button>
        </div>
      </section>

      {/* BEERS */}
      <section id="beers" className="beers-section">
        <div className="container">
          <h2 className="section-title">Наши сорта</h2>
          <div className="beers-grid">
            {beers.map((beer, idx) => (
              <div key={beer.id} className={`beer-card ${isLoaded ? 'fade-in' : ''}`} style={{ animationDelay: `${idx * 0.2}s` }}>
                <img src={beer.img} alt={beer.name} loading="lazy" />
                <div className="beer-info">
                  <h3>{beer.name}</h3>
                  <p className="beer-desc">{beer.desc}</p>
                  <div className="beer-meta">
                    <span>{beer.abv}</span>
                    <strong>{beer.price.toFixed(2)}€</strong>
                  </div>
                  <button className="beer-btn" onClick={() => addToCart(beer)}>Добавить в корзину</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CART */}
      <section id="cart" className="cart-section">
        <div className="container">
          <h2 className="section-title">Ваш заказ</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Корзина пуста. Выберите пиво выше 🍺</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <span>{item.name} × {item.qty}</span>
                    <span>{(item.price * item.qty).toFixed(2)}€</span>
                    <button onClick={() => removeFromCart(item.id)} className="remove-btn">×</button>
                  </div>
                ))}
              </div>
              <div className="cart-total">Итого: <strong>{getTotal()}€</strong></div>
            </>
          )}
        </div>
      </section>

      {/* MAP */}
      <section id="map" className="map-section">
        <div className="container">
          <h2 className="section-title">Доставка по Каарсту</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.226785655768!2d6.671286415738263!3d51.19494997956579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8e5e7c5a5e5e5%3A0x5a5a5a5a5a5a5a5a!2sKaarst%2C%20Germany!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '16px' }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* ORDER FORM */}
      <section id="order" className="order-section">
        <div className="container">
          <h2 className="section-title">Оформить заказ</h2>
          {orderSent ? (
            <div className="success-message">✅ Заказ принят! Мы перезвоним вам в течение 10 минут.</div>
          ) : (
            <form onSubmit={submitOrder} className="order-form">
              <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                value={orderForm.name}
                onChange={handleOrderChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Телефон"
                value={orderForm.phone}
                onChange={handleOrderChange}
                required
              />
              <textarea
                name="comment"
                placeholder="Комментарий (адрес, этаж, код и т.д.)"
                value={orderForm.comment}
                onChange={handleOrderChange}
                rows="3"
              ></textarea>
              <button type="submit" className="order-btn">Оформить заказ 🍻</button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 Craftik Beer — Каарст. Пиво с душой и хмелем 🍻</p>
          <p>Доставка ежедневно с 16:00 до 23:00</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
