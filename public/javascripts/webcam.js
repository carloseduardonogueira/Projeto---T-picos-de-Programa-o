var video = document.getElementById("video");
var img = document.getElementById("photo");
var captured = document.getElementsByClassName("captured");


navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
    var mediaStreamTrack = stream.getVideoTracks()[0];
    imageCapture = new ImageCapture(mediaStreamTrack);
});

function snap() {
    return imageCapture.takePhoto()
        .then(blob => {
            var imageUrl = URL.createObjectURL(blob);
            img.src = imageUrl;
            return blob;
        });
}

function sendTotextDetection() {
    var http = new XMLHttpRequest();
    var url = "cloudVision";
    snap().then((blob) => {
        http.open("POST", url, true);
        http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        http.onreadystatechange = () => {//Call a function when the state changes.
            console.log(http.response);
            sendToTextToSpeech(http.response);    
        }
        var formData = new FormData();
        formData.append("public/images", blob);
        http.send(formData);
    });
}

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
                var audio = new Audio('audio/audioWatson.wav');  
                audio.type = 'audio/wav';

                var playPromise = audio.play();

                if (playPromise !== undefined) {
                    playPromise.then(function () {
                        console.log('Playing....');
                    }).catch(function (error) {
                        console.log('Failed to play....' + error);
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

