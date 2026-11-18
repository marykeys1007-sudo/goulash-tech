import { contact as c } from '../data/content.js';
import { icon } from '../utils/icons.js';

export const LeadForm = () => `
<section class="section" id="contact"><div class="container contact">
  <div class="contact__copy"><p class="eyebrow reveal">Связаться с командой</p><h2 class="h2 reveal">${c.title.join('<br>')}</h2><p class="lead reveal">${c.text}</p>
    <ul class="bul reveal">${c.bullets.map(([i,t])=>`<li>${icon(i,16)}<span>${t}</span></li>`).join('')}</ul>
    <p class="fine reveal">${icon('pin',14)} ${c.note}</p></div>
  <form class="form reveal" id="lead" novalidate>
    <div class="form__head"><span class="tag tag--acc">ЗАПРОС НА ДЕМО</span><span class="fine">Обычно достаточно пары строк</span></div>
    <div class="row">
      <label>Имя<input name="name" class="form-control" placeholder="Как к вам обращаться" autocomplete="name" required minlength="2" maxlength="60" aria-describedby="lead-name-error"><span class="field-error" id="lead-name-error"></span></label>
      <label>Телефон или Telegram<input name="phone" class="form-control" type="text" inputmode="tel" placeholder="+7 999… или @username" autocomplete="tel" autocapitalize="off" spellcheck="false" required maxlength="40" aria-describedby="lead-phone-error"><span class="field-error" id="lead-phone-error"></span></label>
    </div>
    <div class="row"><label>Формат работы<select name="role" required aria-describedby="lead-role-error"><option value="">Выберите</option><option>Частный мастер</option><option>Бригада / небольшой сервис</option><option>Диспетчерская / сервисная компания</option><option>Сеть / несколько филиалов</option></select><span class="field-error" id="lead-role-error"></span></label><label>Направление<select name="dir"><option value="">Не выбрано</option>${c.directions.map(d=>`<option>${d}</option>`).join('')}</select></label></div>
    <label>Что хотите наладить? <b class="req-dot">•</b><textarea name="task" rows="4" required minlength="10" maxlength="1200" placeholder="Например: 4 мастера, 10–15 заказов в день. Хотим распределять заявки и не терять историю клиентов." aria-describedby="lead-task-error"></textarea><span class="field-error" id="lead-task-error"></span></label>
    <label class="check"><input type="checkbox" name="agree" required aria-describedby="lead-agree-error"><span>Согласен на обработку персональных данных для ответа на заявку.</span></label><span class="field-error field-error--check" id="lead-agree-error"></span>
    <button class="btn btn--accent" type="submit">Отправить заявку ${icon('arrow',14)}</button>
    <p class="form__status" id="lead-status" role="status" aria-live="polite"></p>
    <p class="fine">${c.formNote}</p>
  </form>
</div></section>`;

function validateLead(form) {
  const data = Object.fromEntries(new FormData(form));
  const errors = {};
  const name = (data.name || '').trim().replace(/\s+/g, ' ');
  const contact = (data.phone || '').trim();
  const task = (data.task || '').trim();

  if (name.length < 2) errors.name = 'Укажите имя — не менее 2 символов.';
  else if (name.length > 60 || !/^[\p{L}][\p{L}\p{M}\s.'’-]*$/u.test(name)) errors.name = 'Проверьте имя: используйте буквы и обычные знаки препинания.';

  if (!contact) errors.phone = 'Укажите телефон или Telegram.';
  else if (contact.startsWith('@')) {
    if (!/^@[A-Za-z0-9_]{5,32}$/.test(contact)) errors.phone = 'Telegram: укажите @username длиной от 5 до 32 символов.';
  } else {
    const digits = contact.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) errors.phone = 'Введите корректный телефон: от 10 до 15 цифр, включая код страны.';
    else if (!/^[+\d\s().-]+$/.test(contact)) errors.phone = 'В телефоне есть недопустимые символы. Проверьте номер.';
  }

  if (!data.role) errors.role = 'Выберите формат работы.';
  if (task.length < 10) errors.task = 'Опишите задачу подробнее — минимум 10 символов.';
  else if (task.length > 1200) errors.task = 'Сократите описание до 1200 символов.';
  if (!data.agree) errors.agree = 'Необходимо согласие на обработку персональных данных.';

  return { data: { ...data, name, phone: contact, task }, errors };
}

function renderErrors(form, errors) {
  const fields = ['name', 'phone', 'role', 'task', 'agree'];
  fields.forEach(name => {
    const field = form.elements.namedItem(name);
    const message = form.querySelector(`#lead-${name}-error`);
    const error = errors[name] || '';
    if (message) message.textContent = error;
    if (field) {
      field.classList.toggle('is-invalid', Boolean(error));
      if (error) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    }
  });
}

export function initForm(){
  const f = document.getElementById('lead');
  const st = document.getElementById('lead-status');
  if (!f || !st) return;

  f.addEventListener('input', event => {
    const field = event.target;
    if (!field.name || !field.classList.contains('is-invalid')) return;
    const { errors } = validateLead(f);
    renderErrors(f, errors);
  });
  f.addEventListener('change', event => {
    if (event.target.name === 'role' || event.target.name === 'agree') {
      const { errors } = validateLead(f);
      renderErrors(f, errors);
    }
  });

  f.addEventListener('submit', async event => {
    event.preventDefault();
    st.className = 'form__status';
    st.textContent = '';

    const { data, errors } = validateLead(f);
    renderErrors(f, errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      st.textContent = 'Проверьте отмеченные поля — заявку пока нельзя отправить.';
      st.classList.add('err');
      const firstField = f.elements.namedItem(firstError);
      firstField?.focus({ preventScroll: false });
      firstField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const button = f.querySelector('button[type="submit"]');
    button.disabled = true;
    button.classList.add('is-loading');
    const originalLabel = button.dataset.label || button.textContent;
    button.dataset.label = originalLabel;
    button.textContent = 'Сохраняем заявку…';
    st.textContent = 'Проверяем и сохраняем данные';

    try {
      await new Promise(resolve => setTimeout(resolve, 450));
      const key = 'goulash_demo_leads';
      const leads = JSON.parse(localStorage.getItem(key) || '[]');
      leads.push({ ...data, agree: undefined, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(leads));
      st.textContent = 'Заявка сохранена в демо-режиме на этом устройстве. Серверная отправка пока не подключена.';
      st.classList.add('ok');
      f.reset();
      renderErrors(f, {});
    } catch (error) {
      st.textContent = 'Не удалось сохранить заявку в этом браузере. Проверьте настройки хранилища и попробуйте ещё раз.';
      st.classList.add('err');
    } finally {
      button.disabled = false;
      button.classList.remove('is-loading');
      button.textContent = originalLabel;
    }
  });
}
