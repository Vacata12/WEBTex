function onClickAdd() {
    const input = document.querySelector('input');
    const ul = document.querySelector('ul');
    const li = document.createElement('li');
    li.textContent = input.value;
    li.onclick = function() {
        onClickDelete(li);
    };
    ul.appendChild(li);
}

function onClickDelete(li) {
    const ul = document.querySelector('ul');
    ul.removeChild(li);
}