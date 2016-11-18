class Modal {
  constructor() {
    this.el = document.querySelector('.modal');
    this.bindEvents();
  }

  bindEvents() {
    document.querySelector('body').addEventListener('click', e => {
      let { target } = e;

      let modal = target.getAttribute('modal');

      if( modal ) {
        e.preventDefault();
        let content = '';
        let targetElement = document.querySelector(modal);

        if( targetElement ) {
          content = targetElement.innerHTML;
        }

        this.el.querySelector('.content .body').innerHTML = content;
        this.showModal();
      } else if( Array.from(target.classList).includes('modal') || Array.from(target.classList).includes('close') ) {
        this.hideModal();
      }
    });
  }

  hideModal() {
    this.el.classList.add('hidden');
  }

  showModal() {
    this.el.classList.remove('hidden');
  }
}

export default Modal;
