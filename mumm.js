window.onload = function() {
  var arquivo = document.getElementById('arquivo');
  var areaTexto = document.getElementById('areaTexto');
  var canvasMapa = document.getElementById('canvasMapa');
  var gerarMapa = document.getElementById('gerarMapa');
  var abrirImagem = document.getElementById('abrirImagem');
  var ondeFica = document.getElementById('ondeFica');
  var coordenadasOndeFica = document.getElementById('coordenadasOndeFica');

  var menorX = null, menorY = null, maiorX = null, maiorY = null, locais = new Array();
  var texto = "";

  arquivo.addEventListener('change', function(e) {
    var file = arquivo.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function(e) {
        var content = reader.result;
        var linhas = content.split("\n");

// Local
var x, y, nLocais = -1, nCoordenadas;
for(var i = 0; i < linhas.length; i++) {

  if((linhas[i].length > 1) && (linhas[i].substr(0,2) != "//")) {
    // Não é um comentário


    if(linhas[i].indexOf(",") > 0) {
      // São coordenadas

      x = parseInt(linhas[i].substr(0, linhas[i].indexOf(",")));
      y = parseInt(linhas[i].substr(linhas[i].indexOf(",") + 1));

      if(menorX == null) {
        menorX = x;
        menorY = y;
        maiorX = x;
        maiorY = y;
      }
 
      if(x < menorX)
        menorX = x;

      if(y < menorY)
        menorY = y;

      if(x > maiorX)
        maiorX = x;

      if(y > maiorY)
        maiorY = y;

      locais[nLocais].coordenadas[nCoordenadas] = new Object();

      locais[nLocais].coordenadas[nCoordenadas].x = x;
      locais[nLocais].coordenadas[nCoordenadas].y = y;

      nCoordenadas++;

    }
    else {
      // Novo local

      nLocais++;

      locais[nLocais] = new Object();

      if(linhas[i].indexOf(":") > 0) {
        locais[nLocais].tipo = linhas[i].substr(0, linhas[i].indexOf(":"));
        locais[nLocais].nome = linhas[i].substr(linhas[i].indexOf(":") + 1);
      }
      else {
        locais[nLocais].tipo = linhas[i];
        locais[nLocais].nome = linhas[i];
      }

      locais[nLocais].coordenadas = new Array();

      nCoordenadas = 0;
    }
  }

}


menorX -= 40;
menorY -= 40;
maiorX += 40;
maiorY += 40;



                                        
				areaTexto.innerText = texto;
				}

				reader.readAsText(file);	
			} else {
				areaTexto.innerText = "File not supported!";
			}
		});


gerarMapa.addEventListener('click', function(e) {
  // Desenhar o mapa no canvas
  canvasMapa.width = maiorX - menorX;
  canvasMapa.height = maiorY - menorY;

  texto = "X: " + (maiorX - menorX) + " (" + menorX + "," + maiorX +  ") Y: " + (maiorY - menorY)  + " (" + menorY + "," + maiorY +  ")\n";
  texto = texto + ((menorX >= 0 ? Math.floor(menorX/100) : Math.ceil(menorX / 100)) * 100) + "\n";
  texto = texto + ((menorY >= 0 ? Math.floor(menorY/100) : Math.ceil(menorY / 100)) * 100) + "\n";
  var ctx = canvasMapa.getContext("2d");

  var localizacao = "";

  // grade
  ctx.strokeStyle = "#dddddd";
  ctx.font="9px Arial";

  for(var i = ((menorX >= 0 ? Math.floor(menorX/100) : Math.ceil(menorX / 100)) * 100 - menorX); i < (maiorX - menorX); i+=100) {

    ctx.beginPath();
    ctx.moveTo(i,15);
    ctx.lineTo(i,maiorY - menorY - 15);

    localizacao = (i + menorX).toString();

    ctx.fillText(localizacao,i - (localizacao.length * 2),10);
    ctx.stroke();
    ctx.closePath();
  }

  for(var i = ((menorY >= 0 ? Math.floor(menorY/100) : Math.ceil(menorY / 100)) * 100 - menorY); i < (maiorY - menorY); i+=100) {

    ctx.beginPath();
    ctx.moveTo(15,i);
    ctx.lineTo(maiorX - menorX - 15,i);

    localizacao = (i + menorY).toString();

    ctx.fillText(localizacao,10 - (localizacao.length * 2), i+3);
    ctx.stroke();
    ctx.closePath();
  }

  // Pontos cardeais
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(38,29);
  ctx.lineTo(38,59);
  ctx.moveTo(26,44);
  ctx.lineTo(50,44);
  ctx.stroke();
  ctx.closePath();

  ctx.font="14px Arial";
  ctx.fillText("N",33,24);
  ctx.fillText("S",33,73);
  ctx.fillText("L",14,49);
  ctx.fillText("O",55,49);

  ctx.font="9px Arial";

  // Locais
  for(var i = 0; i < locais.length; i++) {

    texto = texto + locais[i].nome + "\n";

    if(locais[i].coordenadas.length > 1) {
      // Linhas

      var maiorXlocal = locais[i].coordenadas[0].x, maiorYlocal = locais[i].coordenadas[0].y, menorXlocal = locais[i].coordenadas[0].x, menorYlocal = locais[i].coordenadas[0].y;

      ctx.beginPath();

      if(locais[i].tipo == "vila")
        ctx.strokeStyle = "#ff0000";
      else
        ctx.strokeStyle = "#666666";

      ctx.moveTo(locais[i].coordenadas[0].x - menorX, locais[i].coordenadas[0].y - menorY);
      texto = texto + locais[i].coordenadas[0].x + "," + locais[i].coordenadas[0].y + "\n";
    
      for(var j = 1; j < locais[i].coordenadas.length; j++) { 

        ctx.lineTo(locais[i].coordenadas[j].x - menorX, locais[i].coordenadas[j].y - menorY);
        texto = texto + locais[i].coordenadas[j].x + "," + locais[i].coordenadas[j].y + "\n";

        if(locais[i].coordenadas[j].x < menorXlocal)
          menorXlocal = locais[i].coordenadas[j].x;

        if(locais[i].coordenadas[j].y < menorYlocal)
          menorYlocal = locais[i].coordenadas[j].y;

        if(locais[i].coordenadas[j].x > maiorXlocal)
          maiorXlocal = locais[i].coordenadas[j].x;

        if(locais[i].coordenadas[j].y > maiorYlocal)
          maiorYlocal = locais[i].coordenadas[j].y;

        if(locais[i].tipo == "caminho") {
          // caminho, mostrar a distancia

          var maiorXcaminho, maiorYcaminho, menorXcaminho, menorYcaminho;

          maiorXcaminho = (locais[i].coordenadas[j].x > locais[i].coordenadas[j - 1].x ? locais[i].coordenadas[j].x : locais[i].coordenadas[j - 1].x);
          maiorYcaminho = (locais[i].coordenadas[j].y > locais[i].coordenadas[j - 1].y ? locais[i].coordenadas[j].y : locais[i].coordenadas[j - 1].y);
          menorXcaminho = (locais[i].coordenadas[j].x < locais[i].coordenadas[j - 1].x ? locais[i].coordenadas[j].x : locais[i].coordenadas[j - 1].x);
          menorYcaminho = (locais[i].coordenadas[j].y < locais[i].coordenadas[j - 1].y ? locais[i].coordenadas[j].y : locais[i].coordenadas[j - 1].y);

          if(maiorXcaminho != menorXcaminho)
            ctx.fillText(maiorXcaminho - menorXcaminho, menorXcaminho + Math.round((maiorXcaminho - menorXcaminho) / 2) - menorX, maiorYcaminho - menorY - 5);
          else
            ctx.fillText(maiorYcaminho - menorYcaminho, maiorXcaminho - menorX + 5, menorYcaminho + Math.round((maiorYcaminho - menorYcaminho) / 2) - menorY);

        }
      }

      if((locais[i].coordenadas[0].x == locais[i].coordenadas[locais[i].coordenadas.length - 1].x) || (locais[i].coordenadas[0].y == locais[i].coordenadas[locais[i].coordenadas.length - 1].y)) {
        // Fechar o "poligono" caso o ponto 0 e o ultimo estejam na mesma reta
        ctx.lineTo(locais[i].coordenadas[0].x - menorX, locais[i].coordenadas[0].y - menorY);
      }

      texto = texto + "centro: " + (menorXlocal + Math.round((maiorXlocal - menorXlocal) / 2)) + "," + (menorYlocal + Math.round((maiorYlocal - menorYlocal) / 2)) + "\n";

      ctx.stroke();
      ctx.closePath();


//    ctx.strokeRect(menorXlocal + Math.round((maiorXlocal - menorXlocal) / 2) - menorX, menorYlocal + Math.round((maiorYlocal - menorYlocal) / 2) - menorY, 1, 1);

      if(locais[i].tipo != "caminho") {
        ctx.fillText(locais[i].nome, menorXlocal + Math.round((maiorXlocal - menorXlocal) / 2) - menorX - (locais[i].nome.length * 2), menorYlocal + Math.round((maiorYlocal - menorYlocal) / 2) - menorY);

        localizacao = (menorXlocal + Math.round((maiorXlocal - menorXlocal) / 2)) + ", " + (menorYlocal + Math.round((maiorYlocal - menorYlocal) / 2));

        ctx.fillText(localizacao, menorXlocal + Math.round((maiorXlocal - menorXlocal) / 2) - menorX - (localizacao.length * 2), menorYlocal + Math.round((maiorYlocal - menorYlocal) / 2) - menorY + 10);
      }
    }
    else {
      // Ponto
      ctx.strokeStyle = "#FF7F00";
      ctx.strokeRect(locais[i].coordenadas[0].x - menorX, locais[i].coordenadas[0].y - menorY,1,1);
      texto = texto + locais[i].coordenadas[0].x + "," + locais[i].coordenadas[0].y + "\n";

      localizacao = locais[i].coordenadas[0].x + ", " + locais[i].coordenadas[0].y;
      ctx.fillText(locais[i].nome, locais[i].coordenadas[0].x - menorX - (locais[i].nome.length * 2), locais[i].coordenadas[0].y - menorY + 10);
      ctx.fillText(localizacao, locais[i].coordenadas[0].x - menorX - (localizacao.length * 2), locais[i].coordenadas[0].y - menorY + 20);
    }
  }

  areaTexto.innerText = texto;

});

abrirImagem.addEventListener('click', function(e) {
  window.open(canvasMapa.toDataURL());
});

ondeFica.addEventListener('click', function(e) {

  if(coordenadasOndeFica.value.indexOf(",") > 0) {
    // São coordenadas

    var x = parseInt(coordenadasOndeFica.value.substr(0, coordenadasOndeFica.value.indexOf(",")));
    var y = parseInt(coordenadasOndeFica.value.substr(coordenadasOndeFica.value.indexOf(",") + 1));

    var ctx = canvasMapa.getContext("2d");

    ctx.strokeStyle = "#32CD32";

    ctx.strokeRect(x - menorX,y-menorY,1,1);

    ctx.beginPath();
    ctx.arc(x - menorX,y-menorY,10,0,2*Math.PI);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x - menorX,y-menorY,20,0,2*Math.PI);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x - menorX,y-menorY,30,0,2*Math.PI);
    ctx.stroke();
    ctx.closePath();

  }
});

}
