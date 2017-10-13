	//Declarar Variaveis
	var latt = 0;
	var lang = 0;
	var matriz=[];
	var velocidade = 0;
	var repetir;
	var date;
	var hours = 0;
	var minutes = 0;
	var seconds =0;
	var latIni =0;
	var langIni = 0
	var latFim = 0;
	var langFim= 0
	var Distancia = 0;
	var controleHoraIni = 0;
	var controleMinutoIni = 0;
	var controleSegundoIni = 0;
	var controleHoraFim = 0;
	var controleMinutoFim = 0;
	var controleSegundoFim = 0;
	var tempoAtividade =0;
	
	navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 20000 });
	
	function onSuccess(position) {
	lat=position.coords.latitude;
	lang=position.coords.longitude;
	date = new Date(position.timestamp);
	hours = date.getHours();
	minutes = date.getMinutes();
	seconds = date.getSeconds();

	
	//Google Maps
	var myLatlng = new google.maps.LatLng(lat,lang);
	var mapOptions = {zoom: 17,center: myLatlng}
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	var marker = new google.maps.Marker({position: myLatlng,map: map});
	
	}
	function onError(error) {
	alert('code: ' + error.code + '\n' +
	'message: ' + error.message + '\n');
	}
	google.maps.event.addDomListener(window, 'load', onSuccess);

	//Iniciar o processo de registrar atividade
		function IniciarAtividade(){
		
		if(document.getElementById("Iniciar").value == "Iniciar"){
		document.getElementById("Iniciar").value = "Parar";
		CriarMatriz();
		HoraInicio();
		}
		else
		{
		  document.getElementById("Iniciar").value = "Iniciar";
		  stopTimeOut();
		  HoraFim();
		  document.getElementById("demo4").innerHTML = "A distancia percorrida foi: " +Distancia;
		  gravarAtividade();
		}
		}
		
	//mapeando o caminha através das coordenadas	
	function CriarMatriz(){
		var controleLat = 0;
		var controleLang = 0;

			controleLat = lat;
			controleLang = lang;
			matriz.push(controleLat+","+controleLang);
			var path = document.getElementById("demo");
			path.innerHTML = matriz.join("|");
			DistanciaPercorrida();
			repetir = setTimeout("CriarMatriz()", 6000);
		}
	function stopTimeOut(){
	clearTimeout(repetir);
	}
	
	
	//registro de tempo, inicio e fim da atividade.
	function HoraInicio()
	{
	controleHoraIni = hours;
	controleMinutoIni = minutes;
	controleSegundoIni = seconds;
		if (controleHoraIni<10){
		controleHoraIni = "0" + controleHoraIni;
		}
		if (controleMinutoIni<10){
		controleMinutoIni = "0" + controleMinutoIni;
		}
		if(controleSegundoIni<10){
		controleSegundoIni = "0" + controleSegundoIni;
		}
		document.getElementById("demo2").innerHTML = "O Horario do inicio da atividade foi: " + controleHoraIni + ":" + controleMinutoIni + ":"+controleSegundoIni;
	}
	
	function HoraFim()
	{
	controleHoraFim = hours;
	controleMinutoFim = minutes;
	controleSegundoFim = seconds;
		if (controleHoraFim<10){
		controleHoraFim = "0" + controleHoraFim;
		}
		if (controleMinutoFim<10){
		controleMinutoFim = "0" + controleMinutoFim;
		}
		if(controleSegundoFim<10){
		controleSegundoFim = "0" + controleSegundoFim;
		}
		document.getElementById("demo3").innerHTML = "O Horario do fim da atividade foi: " + controleHoraFim + ":" + controleMinutoFim + ":"+controleSegundoFim;
		var horaAtividade = controleHoraFim-controleHoraIni;
		var minutoAtividade = controleMinutoFim-controleMinutoIni;
		var segundoAtividade = controleSegundoFim-controleSegundoIni;
		
		if (horaAtividade<10){
		horaAtividade = "0" + horaAtividade;
		}
		if (minutoAtividade<10){
		minutoAtividade = "0" + minutoAtividade;
		}
		if(segundoAtividade<10){
		segundoAtividade = "0" + segundoAtividade;
		}
		tempoAtividade = horaAtividade+":"+minutoAtividade+":"+segundoAtividade;
	}
	
	
	//função utilizada para gravar a distancia percorrida
	function DistanciaPercorrida(){
		
		if (latIni == 0)
		{
			latIni = lat;
			langIni = lang;
			latFim = latIni;
			langFim = langIni;
		}
		latFim = lat;
		langFIm = lang;
         var origin = {lat: latIni ,lng: langIni},
             destination = {lat: latFim, lng: langFim},
             service = new google.maps.DistanceMatrixService();
         
         service.getDistanceMatrix(
             {
                 origins: [origin],
                 destinations: [destination],
                 travelMode: google.maps.TravelMode.WALKING,
				 unitSystem: google.maps.UnitSystem.METRIC,
                 avoidHighways: false,
                 avoidTolls: false
             }, 
             callback
         );
         
         function callback(response, status) {
				 //Distancia = document.getElementById("dist");
         
             if(status=="OK") {
				 var dist = response.rows[0].elements[0].distance.value;
				 Distancia = Distancia + dist;
				 posicaoIni();
             } else {
                 alert("Error: " + status);
             }
         }
	}
	
	function posicaoIni()
	{
		latIni = latFim;
		langIni = langFim;
	}
	
	
	//requisição http para gravar informações coletadas
	function gravarAtividade()
	{
	var xmlHttp = new XMLHttpRequest();
	var url = "http://pedrobeck.com.br/bruno/tcc/app/dao.php?IDAluno=14"+"&PATH="+matriz+"&Distancia="+Distancia+"&tempoAtividade="+tempoAtividade;
	xmlHttp.open("GET", url, true);
	xmlHttp.onreadystatechange = function () {
        if(xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200) {
            console.log(xmlHttp.responseText);
        }
    };
	xmlHttp.send();
	
	}