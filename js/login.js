const URL = 'http://localhost:5000/cafe/';

$("#Login").click(
    async function(event) {
        event.preventDefault();
        
        let password = $("#inputPassword")[0].value;
        let username = $("#inputEmail")[0].value;

        if (!password || !username) {
            alert('Confira os dados do login!');
        } else{
            $.ajax({
                url: `${URL}account/pesquisa/by-acname/${username}`,
                type: 'GET',
                async: false,
                success: function(result) {
                  if(result){
                    if(username === result.username && password === result.password){
                        sessionStorage.username = username;
                        window.location.href = `menu.html`
                    }
                  } else {
                      alert("Usuario nao cadastrado")
                  }
                },
                error: function() {
                    alert('Houve um erro na verificacao do usuario.');
                }
            })
        } 
    }
)