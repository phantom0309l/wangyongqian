    function E(selector) {
      return document.querySelector(selector);
    }



    var gAudioContext = new AudioContext();

    function getAudioContext() {
      if (!gAudioContext) {
          gAudioContext = new AudioContext();
      }
      return gAudioContext;
    }

    function fetchBlob(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.onload = function() {
          callback(this.response);
      };
      xhr.onerror = function() {
          alert('Failed to fetch ' + url);
      };
      xhr.send();
    }

    function readBlob(blob, callback) {
      var reader = new FileReader();
      reader.onload = function(e) {
          var data = new Uint8Array(e.target.result);
          callback(data);
      };
      reader.readAsArrayBuffer(blob);
    }

    function fetchAndReadBlob(url, callback) {
      fetchBlob(url, function(blob) {
          readBlob(blob, callback);
      });
    }

    function playAmrBlob(blob, callback) {
      readBlob(blob, function(data) {
          playAmrArray(data);
      });
    }

    function convertAudioBlobToAmr(blob) {
      readBlob(blob, function(data) {
          var ctx = getAudioContext();
          ctx.decodeAudioData(data.buffer, function(audioBuffer) {
              var pcm;
              if (audioBuffer.copyFromChannel) {
                  pcm = new Float32Array(audioBuffer.length);
                  audioBuffer.copyFromChannel(pcm, 0, 0);
              } else {
                  pcm = audioBuffer.getChannelData(0);
              }
              var amr = AMR.encode(pcm, audioBuffer.sampleRate, 7);
              playAmrArray(amr);
          });
      });
    }

    function playAmrArray(array) {
      var samples = AMR.decode(array);
      if (!samples) {
          alert('Failed to decode!');
          return;
      }
      playPcm(samples);
    }

    function playPcm(samples) {
      var ctx = getAudioContext();
      var src = ctx.createBufferSource();
      var buffer = ctx.createBuffer(1, samples.length, 8000);
      if (buffer.copyToChannel) {
          buffer.copyToChannel(samples, 0, 0)
      } else {
          var channelBuffer = buffer.getChannelData(0);
          channelBuffer.set(samples);
      }

      src.buffer = buffer;
      src.connect(ctx.destination);
      src.start();
    }

    function convertAmrBlobToWav(blob) {
      readBlob(blob, function(data) {
          var buffer = AMR.toWAV(data);
          var url = URL.createObjectURL(new Blob([buffer], { type: 'audio/x-wav' }));
          // Play wav buffer
          var audio = new Audio(url);
          audio.onloadedmetadata = audio.onerror = function() {
              URL.revokeObjectURL(url);
          };
          audio.play();
      });
    }

    $(document).on("click", ".amrbtn", function(){
        var url = $(this).data("url");
        fetchBlob(url, function(blob) {
            playAmrBlob(blob);
        });
    })
