const todo = {
    action(e) {
      const target = e.target;
      if (target.classList.contains('todo__action')) {
        const action = target.dataset.todoAction;
        const elemItem = target.closest('.todo__item');
        if (action === 'deleted' && elemItem.dataset.todoState === 'deleted') {
          elemItem.remove();
        } else {
          elemItem.dataset.todoState = action;
          const lexicon = {
            active: 'восстановлено',
            completed: 'завершено',
            deleted: 'удалено'
          };
          const elTodoDate = elemItem.querySelector('.todo__date');
          const html = `<span>${lexicon[action]}: ${new Date().toLocaleString().slice(0, -3)}</span>`;
          elTodoDate.insertAdjacentHTML('beforeend', html);
        }
        this.save();
      } else if (target.classList.contains('todo__add')) {
        this.add();
        this.save();
      }
    },
    add() {
      const elemText = document.querySelector('.todo__text');
      if (elemText.disabled || !elemText.value.length) {
        return;
      }
      document.querySelector('.todo__items').insertAdjacentHTML('beforeend', this.create(elemText.value));
      elemText.value = '';
    },
    create(text) {
      const date = JSON.stringify({ add: new Date().toLocaleString().slice(0, -3) });
      return `<li class="todo__item" data-todo-state="active" draggable="true">
        <span class="todo__task">
          ${text}
          <span class="todo__date" data-todo-date="${date}">
            <span>добавлено: ${new Date().toLocaleString().slice(0, -3)}</span>
          </span>
        </span>
        <span class="todo__action todo__action_restore" data-todo-action="active"></span>
        <span class="todo__action todo__action_complete" data-todo-action="completed"></span>
        <span class="todo__action todo__action_delete" data-todo-action="deleted"></span></li>`;
    },
    init() {
      const fromStorage = localStorage.getItem('todo');
      if (fromStorage) {
        document.querySelector('.todo__items').innerHTML = fromStorage;
      }
      document.querySelector('.todo__options').addEventListener('change', this.update);
      document.addEventListener('click', this.action.bind(this));
    },
    update() {
      const option = document.querySelector('.todo__options').value;
      document.querySelector('.todo__items').dataset.todoOption = option;
      document.querySelector('.todo__text').disabled = option !== 'active';
    },
    save() {
      localStorage.setItem('todo', document.querySelector('.todo__items').innerHTML);
    },

    
  };
  
  todo.init();

  const todoList = document.querySelector('.todo__items');
  const todoElements = todoList.querySelectorAll('.todo__item');

  todoList.addEventListener('dragstart', (evt) => {
    evt.target.classList.add('selected');
  })

  todoList.addEventListener(`dragend`, (evt) => {
    evt.target.classList.remove(`selected`);
  });

  // todoList.addEventListener(`dragover`, (evt) => {
  //   // Разрешаем сбрасывать элементы в эту область
  //   evt.preventDefault();
  
  //   // Находим перемещаемый элемент
  //   const activeElement = todoList.querySelector(`.selected`);
  //   // Находим элемент, над которым в данный момент находится курсор
  //   const currentElement = evt.target;
  //   // Проверяем, что событие сработало:
  //   // 1. не на том элементе, который мы перемещаем,
  //   // 2. именно на элементе списка
  //   const isMoveable = activeElement !== currentElement &&
  //     currentElement.classList.contains(`todo__item`);
  
  //   // Если нет, прерываем выполнение функции
  //   if (!isMoveable) {
  //     return;
  //   }
  
  //   // Находим элемент, перед которым будем вставлять
  //   const nextElement = (currentElement === activeElement.nextElementSibling) ?
  //       currentElement.nextElementSibling :
  //       currentElement;
  
  //   // Вставляем activeElement перед nextElement
  //   todoList.insertBefore(activeElement, nextElement);
  // });


const getNextElement = (cursorPosition, currentElement) => {
  // Получаем объект с размерами и координатами
  const currentElementCoord = currentElement.getBoundingClientRect();
  // Находим вертикальную координату центра текущего элемента
  const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

  // Если курсор выше центра элемента, возвращаем текущий элемент
  // В ином случае — следующий DOM-элемент
  const nextElement = (cursorPosition < currentElementCenter) ?
      currentElement :
      currentElement.nextElementSibling;

  return nextElement;
};

todoList.addEventListener(`dragover`, (evt) => {
    evt.preventDefault();
  
    const activeElement = todoList.querySelector(`.selected`);
    const currentElement = evt.target;
    const isMoveable = activeElement !== currentElement &&
      currentElement.classList.contains(`todo__item`);
  
    if (!isMoveable) {
      return;
    }
  
    // evt.clientY — вертикальная координата курсора в момент,
    // когда сработало событие
    const nextElement = getNextElement(evt.clientY, currentElement);
  
    // Проверяем, нужно ли менять элементы местами
    if (
      nextElement &&
      activeElement === nextElement.previousElementSibling ||
      activeElement === nextElement
    ) {
      // Если нет, выходим из функции, чтобы избежать лишних изменений в DOM
      return;
    }
  
    todoList.insertBefore(activeElement, nextElement);
  });