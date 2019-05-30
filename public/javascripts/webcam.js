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
        http.send(formData)
    })    
}

/* function sendToTextDetection() {
    snap().then((blob) => {
        var formData = new FormData(blob);
        formData.set("public/images", blob);
        $.ajax({
            url: 'cloudVision',
            type: 'post',
            data: formData,
            processData: false,
            // tratamento de erro do post
            error: function (dados) {
                console.log( dados);
                console.log('Erro: ' + dados.responseText);
                alert('Erro no processamento da API cloudVision');
            },
            // tratamento de sucesso de processamento do post
            success: function (dados) {
                // se ocorreu algum erro no processamento da API
                if (dados.status === 'ERRO')
                    alert('Erro: ' + dados.data); 
                // caso os dados tenham retornado com sucesso
                else {
                    sendToTextToSpeech(dados.data);
                } 
            }
        });
    });
}
 */
function sendToTextToSpeech(texto) {
    $.ajax({
        url: 'watsonTextToSpeech',
        type: 'post',
        data: {texto: texto},
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
                // play no audio retornado
                var audio = document.createElement('audio');
                audio.setAttribute('src', 'audio/audioWatson.wav');
                audio.currentTime = 0;

                var playPromise = audio.play();

                if (playPromise !== undefined) {
                    playPromise.then(function () {
                        console.log('Play no audio....');                        
                    }).catch(function (error) {
                        console.log('Falhou....' + error);
                    });                    
                } 
                // ao finalizar o audio, seta o atributo para vazio (evita cache)
                audio.addEventListener('ended', function () {
                    audio.currentTime = 0;
                    audio.setAttribute('src', '');
                });    
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
                if (retorno === "repetir"){
                    console.log("ok");
                }
                else{
                    console.log(retorno);
                }
            }
        }
    });
}


