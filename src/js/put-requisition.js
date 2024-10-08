// Кнопка оставить заявку, открыть feedback

import { feedback } from './feedback.js';
import { addHidden } from './modal-menu';

const header = document.querySelector('.header');
const putRequisitionLink = header.querySelector('.nav__link--put-requisition');

putRequisitionLink.addEventListener('click', () => {

  feedback.scrollIntoView();
  document.body.style.overflow = 'hidden';
  addHidden([feedback]);

});

export { header }
