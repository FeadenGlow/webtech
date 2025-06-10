
    const STORAGE_KEY = 'buyListData';
    let items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
      { name: 'Помідори', qty: 2, bought: true },
      { name: 'Печиво', qty: 2, bought: false },
      { name: 'Сир', qty: 1, bought: false }
    ];

    const itemsContainer = document.getElementById('items');
    const newItemInput = document.getElementById('new-item');
    const addBtn = document.getElementById('add-btn');
    const remainingPanel = document.getElementById('remaining');
    const boughtPanel = document.getElementById('bought');

    function save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function render() {
      itemsContainer.innerHTML = '';
      remainingPanel.innerHTML = '';
      boughtPanel.innerHTML = '';

      items.forEach((item, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item';

        const nameEl = document.createElement(item.bought ? 'span' : 'span');
        nameEl.className = 'name';
        if (item.bought) {
          nameEl.innerHTML = `<s>${item.name}</s>`;
        } else {
          nameEl.textContent = item.name;
          nameEl.addEventListener('click', () => startEditName(idx, nameEl));
        }
        itemEl.appendChild(nameEl);


        const controls = document.createElement('div');
        controls.className = 'controls';
        const qtyEl = document.createElement('span');
        qtyEl.className = 'quantity';
        qtyEl.textContent = item.qty;

        if (!item.bought) {
          const minus = document.createElement('button');
          minus.className = 'btn-minus';
          minus.textContent = '-';
          minus.setAttribute('data-tooltip', 'Зменшити кількість');
          minus.disabled = item.qty <= 1;
          minus.addEventListener('click', () => updateQty(idx, -1));

          const plus = document.createElement('button');
          plus.className = 'btn-plus';
          plus.textContent = '+';
          plus.setAttribute('data-tooltip', 'Збільшити кількість');
          plus.addEventListener('click', () => updateQty(idx, +1));

          controls.append(minus, qtyEl, plus);
        } else {
          controls.append(qtyEl);
        }
        itemEl.appendChild(controls);

        // Кнопки стану і видалення
        const ctrl2 = document.createElement('div'); ctrl2.className = 'controls';
        const toggle = document.createElement('button'); toggle.className = 'btn-bought';
        toggle.textContent = item.bought ? 'Зробити не купленим' : 'Куплено';
        toggle.setAttribute('data-tooltip', item.bought ? 'Відмітити як не куплене' : 'Відмітити як куплене');
        toggle.addEventListener('click', () => toggleBought(idx));
        ctrl2.append(toggle);

        if (!item.bought) {
          const del = document.createElement('button');
          del.className = 'delete';
          del.textContent = 'x';
          del.setAttribute('data-tooltip', 'Видалити товар');
          del.addEventListener('click', () => deleteItem(idx));
          ctrl2.append(del);
        }
        itemEl.appendChild(ctrl2);

        itemsContainer.appendChild(itemEl);

        const badge = document.createElement('div'); badge.className = 'badge-item';
        if (item.bought) {
          badge.innerHTML = `<s>${item.name}</s><span class="badge-count"><s>${item.qty}</s></span>`;
          boughtPanel.appendChild(badge);
        } else {
          badge.innerHTML = `${item.name} <span class="badge-count">${item.qty}</span>`;
          remainingPanel.appendChild(badge);
        }
      });
      save();
      newItemInput.value = '';
      newItemInput.focus();
    }

    function addItem() {
      const name = newItemInput.value.trim();
      if (!name) return;
      items.push({ name, qty: 1, bought: false });
      render();
    }

    function deleteItem(i) { items.splice(i,1); render(); }
    function toggleBought(i) { items[i].bought = !items[i].bought; render(); }
    function updateQty(i, delta) { items[i].qty += delta; render(); }

    function startEditName(i, el) {
      const input = document.createElement('input'); input.type = 'text'; input.value = items[i].name; input.className = 'name';
      input.setAttribute('data-tooltip', 'Редагувати назву');
      el.replaceWith(input);
      input.focus();
      input.addEventListener('blur', () => {
        items[i].name = input.value.trim() || items[i].name;
        render();
      });
      input.addEventListener('keydown', e => { if(e.key === 'Enter') input.blur(); });
    }

    addBtn.addEventListener('click', addItem);
    newItemInput.addEventListener('keydown', e => { if (e.key === 'Enter') addItem(); });

    render();