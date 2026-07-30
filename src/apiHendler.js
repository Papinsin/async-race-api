const URL = 'http://localhost:3000'

async function fetchData(URL){
    let data = await((await fetch(`${URL}/garage`)).json() )   
    console.log(data)
}
fetchData(URL)