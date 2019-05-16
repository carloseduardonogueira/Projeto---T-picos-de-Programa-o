let video = document.getElementById("video");
let img = document.getElementById("photo");
let captured = document.getElementsByClassName("captured");


navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
    let mediaStreamTrack = stream.getVideoTracks()[0];
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
        }
        var formData = new FormData();
        formData.append("public/images", blob);
        http.send(formData);
    });
}

function sendToTextToSpeech() {
    $.ajax({
        url: 'watsonTextToSpeech',
        type: 'post',
        data: {texto: 'Testando'},
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
                var audioElement = document.createElement('audio');
                audioElement.setAttribute('src', 'audio/audioWatson.wav');
                audioElement.load();
                audioElement.play();
                 // ao finalizar o audio, seta o atributo para vazio (evita cache)
                 audioElement.addEventListener('ended', function () {
                    audioElement.currentTime = 0;
                    audioElement.setAttribute('src', '');
                });   
            } 
        }
    });
}

