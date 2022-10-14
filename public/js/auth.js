const url = ( window.location.hostname.includes('localhost'))?'http://localhost:8080/api/auth/':'https://js-chat-sockets.herokuapp.com/api/auth/';


const miFormulario = document.querySelector("form");


miFormulario.addEventListener("submit", ev=>{
    ev.preventDefault();
    const formData = {};

    for(let  el of miFormulario.elements ){
        if(el.name.length > 0)
            formData[el.name] = el.value
        
    }

    fetch(url + "login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {  'Content-Type':'application/json' }
})
.then(resp => resp.json())
.then(({msg,token}) =>{
    if(msg) {
        return console.error(msg)
    }

    localStorage.setItem("token", token)
    window.location= "chat.html"
} )
.catch(err => {
    console.log(err)
})

})

function handleCredentialResponse(response) {
    const body = {id_token: response.credential };

// VERSION PARA HEROKU Y LOCALHOST AL MISMO TIEMPO

fetch (url + "google", {
 
method: 'POST',
headers:{
 'Content-Type':'application/json'
},
body: JSON.stringify(body)
})
.then( r => r.json() )
.then( ({token}) => {
    localStorage.setItem("token", token)
    window.location= "chat.html"
})
.catch( console.warn() );
    }   


    const button = document.getElementById("sign-out")

    button.onclick = () =>{

       
        // console.log(google.accounts.id)
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(localStorage.getItem("email"), done =>{
            localStorage.clear()
            window.location.reload()
        })
    }
