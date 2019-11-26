
	var mid = 'http://localhost:5000/toddy/';
	// adiciona todos os lotes no select
	$(document).ready(function () {
		$.ajax({
			url: mid + 'buscarLotes',
			type: 'GET',
			success: function (result) {
				$.each(result, function (indice, toddy) {
					$("#lote").append(`<option value="` + toddy.lote + `">Lote: ` + toddy.lote + `</option>`);
					$("#lote_input").append(`<option value="` + toddy.lote + `">Lote: ` + toddy.lote + `</option>`);
				});
			},
			error: function () {
				alert('Houve um erro.');
			}
		})
	});

	// adiciona os valores retornados na tabela
	$("#lote").change(
		function () {
			var lote = this.value; 
			let value_checkBox = false;

			// verifica se esta checado e atribui o valor de true se estiver checado
			if ($('#vencidos').is(":checked")) {
				value_checkBox = true;
			}

			$("#lote").attr("disabled", true); //Desabilito o combobox
			
			$.ajax({
				url: mid + 'buscarPorLote?lote=' + lote + '&vencidos=' + value_checkBox,
				type: 'GET',
				success: function (result) {

					$("#tabela > tbody").empty();

					$.each(result, function (indice, toddy) {
						$("#tabela > tbody").append(
							`<tr>`+
							`<td>`+toddy.id+`</td>`+
							`<td>`+toddy.lote+`</td>`+
							`<td>`+toddy.conteudo+`</td>`+
							`<td>`+toddy.validade+`</td>`+
							`</tr>`
						);
					});

					if(result.length == 0) alert('Sem dados para essa opção')
				},
				error: function () {
					alert('Houve um erro.');
				},
				complete: function () {
					$("#lote").attr("disabled", false); //Terminando habilito o combobox
				}
			})
		}
	);

	$("#botao_cadastrar").click(
		function () {
			let loteValue = $('#lote_input').val();
			let conteudoValue = $('#conteudo_input').val();
			let auxDate = ($('#validade_input').val()).split("-");
			let validadeValue = `${auxDate[2]}/${auxDate[1]-1}/${auxDate[0]}`;

			console.log(loteValue);
			console.log(conteudoValue);
			console.log(validadeValue);

			let body = {
				lote: loteValue,
   				conteudo: conteudoValue,
    			validade: validadeValue
			}

			$.ajax({
				url: mid + 'inserir',
				type: 'POST',
				data: body,
				success: function (result) {
					alert('Que tiro foi esse?!');
					$('#lote_input').val('');;
					$('#conteudo_input').val('');;
					$('#validade_input').val('');;
				},
				error: function () {
					alert('Houve um erro.');
				},
				complete: function () {
					
				}
			})
		}
	);

	$("#botao").click(
		function () {
			//Toggle => exibe ou oculta o tbody
			$("#tabela > tbody").toggle();
		}
	);