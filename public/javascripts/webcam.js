var video = document.getElementById("video");
var img;

function start(){
    var video = document.getElementById("video");
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
       video.srcObject = stream;
       var mediaStreamTrack = stream.getVideoTracks()[0];
       imageCapture = new ImageCapture(mediaStreamTrack);
    });
}

function playAudio(){
    // play no audio retornado
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'audio/audioWatson.mp3');
    audioElement.play();
    // ao finalizar o audio, seta o atributo para vazio (evita cache)
    audioElement.addEventListener('ended', function () {
        audioElement.currentTime = 0;
        audioElement.setAttribute('src', '');
    }); 
}

function snap() {
    img = document.getElementById("photo");
    return imageCapture.takePhoto()
        .then(blob => {
            var imageUrl = URL.createObjectURL(blob);
            img.src = imageUrl;
            return blob;
        });
}

function sendToTextDetection() {
    var http = new XMLHttpRequest();
    var url = "cloudVision";
    snap().then((blob) => {
        http.open("POST", url, true);
        http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        http.onreadystatechange = () => {//Call a function when the state changes.
            if(http.readyState === 4 && http.responseText !== "")
                sendToTextToSpeech(http.response);
        }
        var formData = new FormData();
        formData.append("public/images", blob);
        http.send(formData);
    })    
}

function sendToTextToSpeech(texto) {
    // post para o serviço watsonTextToSpeech
    $.ajax({
        url: 'watsonTextToSpeech',
        type: 'post',
        data: { texto: texto },
        // tratamento de erro do post
        error: function (dados) {
            console.log('Erro: ' + dados.responseText);
            alert('Erro no processamento da API watsonTextToSpeech');
        },
        // tratamento de sucesso de processamento do post
        success: function (dados) {
            // se ocorreu algum erro no processamento da API
            if (dados.status === 'ERRO')
                alert('Erro: ' + dados.data);
            // caso os dados tenham retornado com sucesso
            else {
                playAudio();
            }
        }
    });
}    

// envia audio do usuário e converte para texto
function speechToText(blob) {
    // criar um formulário para enviar o arquivo de audio
    var fd = new FormData();
    fd.append('audioFile', blob);
    // post para o serviço watsonSpeechToText
    $.ajax({
        url: 'watsonSpeechToText',
        type: 'post',
        data: fd,
        processData: false,
        contentType: false,
        // tratamento de erro do post
        error: function (dados) {
            alert('Erro: ' + dados.responseText);
        },
        // tratamento de sucesso de processamento do post
        success: function (dados) {
            // se ocorreu algum erro no processamento da API
            if (dados.status === 'ERRO')
                alert('Erro: ' + dados.data);
            // caso os dados tenham retornado com sucesso
            else {
                // recupera a conversão do audio em texto
                var retorno = JSON.stringify(dados.data.results[0].alternatives[0].transcript).replace(/"/g, '');
                // envia o texto do audio para reconhecer uma palavra e mandar o comando
                if (retorno.indexOf("capturar") > -1 ? true : false){
                    console.log("Capturando imagem");
                    sendToTextDetection(); 
                }
                else if(retorno.indexOf("repetir") > -1 ? true : false){
                    console.log("Repetindo audio");
                    playAudio(); 
                }
                else{
                     console.log(retorno);
                }
            }
        }
    });
}


