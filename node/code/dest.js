var ds = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('ERRORS');
        }, 10)
    });
}

var demo = async function() {
    try {
        var aa = await ds().then(() => {
            return new Error('error!!!')
          })
        console.log(aa)
    } catch (error) {
        console.log(error);        
    }
}

demo();