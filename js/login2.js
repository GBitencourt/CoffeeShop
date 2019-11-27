const URL = 'http://localhost:5000/cafe/';

$(document).ready(function() {
    console.log("Carregou o DOM");
});

$("#Submit").click(
    function(event) {
        event.preventDefault();
        console.log('clicou');
        let password = $("#password")[0].value;
        let username = $("#username")[0].value;

        let body = {
            username: username,
            password: password
        }
        if (!password || !username) {
            alert('Confira os dados de entrada!');
        } else {
            debugger
            $.ajax({
                url: URL + 'inserir',
                type: 'POST',
                data: body,
                async: false,
                success: function(result) {
                    console.log(result);
                    window.location.href = "login.html";
                },
                error: function() {
                    alert('Houve um erro.');
                }
            })
        }

    }
)