const ATM = (function() {
    let balance = 0;

    return {
        print() {
            console.log(balance)
        },
        deposit(money) {
            balance += money
            console.log(`${money} successfuly added to your accout`)
        },
        withraw(money) {
            if (money > balance) {
                console.log("Not enough\n")
                return
            }
            balance -= money
            console.log(`${money} successfuly withraw from your accout`)
        }
    }
})()

ATM.deposit(1000)
ATM.withraw(500)
ATM.print()
ATM.withraw(600)
