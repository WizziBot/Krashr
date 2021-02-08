let ar = []

function testF(){
    ar.push(false)
}

if(true){
    testF()
}
console.log(ar)