
function SoundManager( ) {
  var scope = this,
    onReadyCallback = function() {},
    audioElements = {},
    soundsToLoad = [];
  
  function loadNextSound() {

    if( soundsToLoad.length === 0 ) {
      onReadyCallback();
      return;
    }

    var soundToLoad = soundsToLoad.shift(),
      audioElement = document.createElement( 'audio' ),
      sourceElement = document.createElement( 'source' );

    audioElement.preload = 'auto';

    audioElement.addEventListener( 'canplaythrough', function onAudioLoaded() {
      audioElement.removeEventListener( 'canplaythrough', onAudioLoaded, false );
      soundToLoad.loaded = true;
      soundToLoad.audioElement = audioElement;
      audioElements[ soundToLoad.name ] = soundToLoad;
      loadNextSound();
    }, false );
      
    sourceElement.src = soundToLoad.url;
    audioElement.appendChild( sourceElement );
    audioElement.load();

    document.body.appendChild( audioElement );

    if( soundsToLoad.length > 0) {
      loadNextSound();
    }

  }

  /*
   * toLoad = [ { url: 'data/sound.wav', name: sound } ]
   */ 
  this.load = function( toLoad ) {

    toLoad.forEach(function( sound ) {
      soundsToLoad.push({ url: sound.url, name: sound.name, loaded: false });
    });
    loadNextSound();

  };

  this.playSound = function( soundName, volume, onlyOneInstance ) {
    var sound = audioElements[ soundName ];
    if( sound === undefined ) {
      return;
    }

    volume = volume !== undefined ? volume : 1;

    onlyOneInstance = onlyOneInstance !== undefined ? onlyOneInstance : false;

    if( onlyOneInstance ) {
      scope.stopSound( soundName );
    }

    var cloned = sound.audioElement.cloneNode( true );
    sound.clonedElement = cloned;
    cloned.volume = volume;
    cloned.play();
  };

  this.stopSound = function( soundName ) {
    var sound = audioElements[ soundName ];
    if( sound === undefined ) {
      return;
    }
    if ( sound.clonedElement !== undefined ) {
      sound.clonedElement.pause();
    }
  };

  this.onReady = function( readyCallback ) {
	  onReadyCallback = readyCallback;
  };

}
