function onClickAdd()
{
    const input = document.querySelector('input');
    const ul = document.querySelector('ul')
    const li = document.createElement('li')
    li.textContent = input.value
    ul.appendChild(li)
}