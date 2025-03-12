
function expect(val) {
    return {
        toBe:(newABC) =>  {
            if(val !== newABC) {
                throw new Error('Type error')
            }
        }, 
        toHaveClass:(cl) => {
            if(val instanceof(HTMLElement)) {
                if(!val.parentElement.classList.contains(cl)) {
                    throw new Error('Class is not in html element')
                }
            }
            else {
                throw new TypeError('Not html type')
            }
        }
    }
}