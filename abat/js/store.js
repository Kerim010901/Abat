// Maglumat ammary: sargytlary brauzeriň localStorage-ynda saklaýar.
// Sahypa täzelenende üýtgeşmeler ýitmeýär. «Demony täzeden başla» düwmesi
// nusga maglumatlary dikeldýär.

const Store = (() => {
  const KEY = 'abat-demo-v1';
  const clone = value => JSON.parse(JSON.stringify(value));

  let state = load();

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && Array.isArray(saved.orders)) return saved;
    } catch (e) { /* localStorage elýeterli däl — nusga maglumatlary ulanýarys */ }
    return { orders: clone(MOCK_ORDERS), events: clone(MOCK_EVENTS) };
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ýatda saklap bolmady */ }
  }

  return {
    get orders() { return state.orders; },
    get events() { return state.events; },

    find(code) {
      return state.orders.find(o => o.code === code);
    },

    nextCode() {
      const max = Math.max(2400, ...state.orders.map(o => Number(o.code.split('-')[1])));
      return 'AB-' + (max + 1);
    },

    addOrder(order) {
      state.orders.unshift(order);
      this.log(order.code + ' · Täze enjam kabul edildi');
      save();
    },

    updateOrder(code, changes, summary) {
      const order = this.find(code);
      Object.assign(order, changes);
      if (summary) {
        order.history.push({ text: summary, time: now() });
        this.log(code + ' · ' + summary);
      }
      save();
    },

    log(text) {
      state.events.unshift({ text, time: now() });
      state.events = state.events.slice(0, 30);
    },

    reset() {
      state = { orders: clone(MOCK_ORDERS), events: clone(MOCK_EVENTS) };
      save();
    },
  };
})();

// Häzirki wagt Aşgabat wagt guşagynda: "04.10.2026 · 10:25"
function now() {
  const d = new Date();
  const opts = { timeZone: 'Asia/Ashgabat' };
  const date = new Intl.DateTimeFormat('en-GB', { ...opts, day: '2-digit', month: '2-digit', year: 'numeric' })
    .format(d).replaceAll('/', '.');
  const time = new Intl.DateTimeFormat('en-GB', { ...opts, hour: '2-digit', minute: '2-digit' }).format(d);
  return date + ' · ' + time;
}
